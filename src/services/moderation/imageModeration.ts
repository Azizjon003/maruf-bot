/**
 * NSFW rasm moderatsiyasi — Python NudeNet worker'iga ko'prik.
 *
 * `nsfw_worker.py` doimiy jarayon sifatida bir marta ishga tushiriladi
 * (model bir marta yuklanadi). Bu modul rasm baytlarini base64 qilib
 * stdin orqali yuboradi va stdout'dan SAFE/UNSAFE javobini oladi.
 *
 * Asosiy funksiya:
 *     isImageSafe(bytes) -> Promise<boolean>
 *
 * Sozlamalar (env):
 *     IMAGE_MODERATION_ENABLED — "false" bo'lsa o'chiriladi (default: yoqilgan)
 *     PYTHON_BIN               — python interpretatori (default: "python")
 *     NUDENET_THRESHOLD        — worker'ga uzatiladi (default: 0.5)
 *
 * Fail-open siyosati: worker ishlamasa yoki xato bo'lsa `true` (xavfsiz)
 * qaytaradi — chunki Unsplash allaqachon `exclude_nudity=true` bilan
 * filtrlagan; generatsiyani butunlay to'xtatib qo'ymaslik uchun.
 */
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import path from "path";

const MODERATION_ENABLED =
  (process.env.IMAGE_MODERATION_ENABLED || "true").toLowerCase() !== "false";

const PYTHON_BIN = process.env.PYTHON_BIN || "python";
const WORKER_SCRIPT = path.join(__dirname, "nsfw_worker.py");

// Bitta so'rovga javob kutilmaydigan vaqt (ms) — keyin fail-open
const REQUEST_TIMEOUT_MS = 30_000;

let worker: ChildProcessWithoutNullStreams | null = null;
let workerFailed = false;

// Javoblarni navbat bilan kutamiz (worker bir vaqtda bitta qatorga javob beradi)
const pending: Array<(line: string) => void> = [];
let stdoutBuffer = "";

function startWorker(): ChildProcessWithoutNullStreams | null {
  if (worker) return worker;
  if (workerFailed) return null;

  try {
    const proc = spawn(PYTHON_BIN, [WORKER_SCRIPT], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    proc.stdout.setEncoding("utf-8");
    proc.stdout.on("data", (chunk: string) => {
      stdoutBuffer += chunk;
      let idx: number;
      while ((idx = stdoutBuffer.indexOf("\n")) !== -1) {
        const line = stdoutBuffer.slice(0, idx).trim();
        stdoutBuffer = stdoutBuffer.slice(idx + 1);
        if (line === "READY") continue; // tayyorlik signali
        const resolve = pending.shift();
        if (resolve) resolve(line);
      }
    });

    proc.stderr.setEncoding("utf-8");
    proc.stderr.on("data", (chunk: string) => {
      // Worker diagnostikasi — log qilib qo'yamiz
      process.stdout.write(`[nsfw_worker] ${chunk}`);
    });

    const onDead = () => {
      worker = null;
      // Kutib turgan so'rovlarni fail-open bilan yopamiz
      while (pending.length) {
        const resolve = pending.shift();
        if (resolve) resolve("SAFE");
      }
    };

    proc.on("exit", onDead);
    proc.on("error", (err) => {
      console.log("Moderatsiya: worker ishga tushmadi:", err);
      workerFailed = true;
      onDead();
    });

    worker = proc;
    return worker;
  } catch (err) {
    console.log("Moderatsiya: worker spawn xatosi:", err);
    workerFailed = true;
    return null;
  }
}

/**
 * Rasm baytlarini NSFW uchun tekshiradi.
 * @returns true — xavfsiz (yoki moderatsiya o'chirilgan/imkonsiz), false — NSFW
 */
export async function isImageSafe(bytes: Buffer | null): Promise<boolean> {
  if (!MODERATION_ENABLED) return true;
  if (!bytes || bytes.length < 100) return true;

  const proc = startWorker();
  if (!proc) return true; // fail-open

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const done = (safe: boolean) => {
      if (settled) return;
      settled = true;
      resolve(safe);
    };

    const timer = setTimeout(() => {
      // Javob kelmadi — navbatdagi joyni bo'shatmaymiz (worker baribir javob bersa
      // tartib buziladi), shuning uchun fail-open qilamiz
      console.log("Moderatsiya: worker javobi kechikdi — fail-open");
      done(true);
    }, REQUEST_TIMEOUT_MS);

    pending.push((line: string) => {
      clearTimeout(timer);
      if (line === "UNSAFE") {
        done(false);
      } else {
        // SAFE yoki ERROR — fail-open
        done(true);
      }
    });

    try {
      proc.stdin.write(bytes.toString("base64") + "\n");
    } catch (err) {
      clearTimeout(timer);
      console.log("Moderatsiya: worker'ga yozishda xato:", err);
      pending.pop(); // qo'shgan resolverni olib tashlaymiz
      done(true); // fail-open
    }
  });
}
