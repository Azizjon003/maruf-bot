/**
 * NSFW filter tests for the TS image search (used by the 3 JS slide designs).
 *
 * 1. searchImages skips images the filter rejects and never returns them.
 * 2. imageModeration.ts turns a worker "UNSAFE" answer into false.
 * 3. The real NudeNet worker passes a clean image.
 *
 * Run inside the container:  npx ts-node --transpile-only tests/searchImages.filter.test.ts
 */
import assert from "assert";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = path.join(__dirname, "..");
let failed = 0;
const test = async (name: string, fn: () => Promise<void>) => {
  try {
    await fn();
    console.log(`  ok   ${name}`);
  } catch (e: any) {
    failed++;
    console.log(`  FAIL ${name}\n       ${e.message}`);
  }
};

// Fake network: Anubis challenge, Unsplash search with 5 images, image bytes.
const installFakeFetch = () => {
  (globalThis as any).fetch = async (input: any) => {
    const url = String(input);
    if (url.includes(".within.website?redir")) {
      const challenge = { challenge: { id: "t", randomData: "abc" }, rules: { difficulty: 1 } };
      return new Response(
        `<script id="anubis_challenge" type="application/json">${JSON.stringify(challenge)}</script>`,
        { status: 200 },
      );
    }
    if (url.includes("pass-challenge")) {
      return new Response(null, {
        status: 302,
        headers: { "set-cookie": "techaro.lol-anubis-auth=tok; Path=/" },
      });
    }
    if (url.includes("ngetty")) {
      const images = [0, 1, 2, 3, 4].map((i) => ({ display_sizes: [{ uri: `https://img/${i}` }] }));
      return new Response(JSON.stringify({ images }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    if (url.startsWith("https://img/")) {
      return new Response(Buffer.from(url.padEnd(300, "x")), { status: 200 });
    }
    throw new Error("unexpected fetch " + url);
  };
};

// Runs a snippet in a fresh node process (module config is read at load time).
const runIsolated = (code: string, env: Record<string, string>) =>
  execFileSync("node", ["-r", "ts-node/register/transpile-only", "-e", code], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    encoding: "utf-8",
    timeout: 120_000,
  });

(async () => {
  console.log("searchImages NSFW filter");
  installFakeFetch();
  const moderation = require(path.join(ROOT, "src/services/moderation/imageModeration"));
  const { searchImages } = require(path.join(ROOT, "src/services/searchImages.service"));

  const checked: string[] = [];
  const useFilter = (bad: Set<string>) => {
    checked.length = 0;
    moderation.isImageSafe = async (bytes: Buffer) => {
      const uri = bytes.toString().replace(/x+$/, "");
      checked.push(uri);
      return !bad.has(uri);
    };
  };

  await test("rejected images are skipped, next safe one is used", async () => {
    useFilter(new Set(["https://img/1", "https://img/2"]));
    const uri = await searchImages("test", 1);
    assert.strictEqual(uri, "https://img/3");
    assert.deepStrictEqual(checked, ["https://img/1", "https://img/2", "https://img/3"]);
  });

  await test("all candidates rejected -> neutral fallback, never a rejected image", async () => {
    const bad = new Set([0, 1, 2, 3, 4].map((i) => `https://img/${i}`));
    useFilter(bad);
    const uri = await searchImages("test", 1);
    assert.ok(!bad.has(uri), `returned rejected image ${uri}`);
    assert.ok(uri.includes("shah-i-zinda"), `unexpected fallback ${uri}`);
  });

  console.log("imageModeration worker bridge");
  const fakeWorker = "/tmp/fake_unsafe_worker.sh";
  fs.writeFileSync(fakeWorker, '#!/bin/sh\necho READY\nwhile read l; do echo UNSAFE; done\n', { mode: 0o755 });

  await test("worker answer UNSAFE -> isImageSafe returns false", async () => {
    const out = runIsolated(
      `require("./src/services/moderation/imageModeration").isImageSafe(Buffer.alloc(500, 1)).then(r => { console.log("RESULT=" + r); process.exit(0); })`,
      { PYTHON_BIN: fakeWorker },
    );
    assert.match(out, /RESULT=false/);
  });

  await test("real NudeNet worker passes a clean image", async () => {
    const out = runIsolated(
      `require("./src/services/moderation/imageModeration").isImageSafe(require("fs").readFileSync("image.png")).then(r => { console.log("RESULT=" + r); process.exit(0); })`,
      { PYTHON_BIN: "python3" },
    );
    assert.match(out, /NudeNet modeli yuklandi/, "model did not load");
    assert.match(out, /RESULT=true/);
  });

  console.log(failed ? `\n${failed} test(s) FAILED` : "\nAll TS filter tests passed");
  process.exit(failed ? 1 : 0);
})();
