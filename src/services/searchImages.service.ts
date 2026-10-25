import crypto from "crypto";
import { isImageSafe } from "./moderation/imageModeration";

const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

const UNSPLASH_HEADERS: Record<string, string> = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9",
  "User-Agent": USER_AGENT,
  "sec-ch-ua":
    '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Linux"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  Referer: "https://unsplash.com/s/photos/technology",
  "Referrer-Policy": "origin-when-cross-origin",
};

let cachedAnubisCookie: string | null = null;
let cookieExpiresAt: number = 0;

function extractCookies(headers: Headers): string {
  const cookies: string[] = [];
  // getSetCookie() bir nechta Set-Cookie headerlarni qaytaradi
  const setCookies =
    typeof headers.getSetCookie === "function"
      ? headers.getSetCookie()
      : (headers.get("set-cookie") || "").split(", ");

  for (const sc of setCookies) {
    const nameVal = sc.split(";")[0]?.trim();
    if (nameVal) cookies.push(nameVal);
  }
  return cookies.join("; ");
}

async function solveAnubisChallenge(): Promise<string | null> {
  try {
    const redir = "/ngetty/v3/search/images/creative";

    // 1. Challenge sahifasini olish
    const challengeUrl = `https://unsplash.com/.within.website?redir=${encodeURIComponent(redir)}`;
    const page = await fetch(challengeUrl, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });

    console.log(`Anubis: challenge sahifa status=${page.status}`);
    const pageCookies = extractCookies(page.headers);
    console.log(`Anubis: sahifa cookie'lari: ${pageCookies || "(yo'q)"}`);

    const html = await page.text();

    // 2. Challenge JSON ni ajratib olish
    const match = html.match(
      /<script id="anubis_challenge" type="application\/json">([\s\S]*?)<\/script>/,
    );
    if (!match) {
      console.log("Anubis: challenge topilmadi HTML dan");
      console.log("Anubis: HTML boshi:", html.slice(0, 300));
      return null;
    }

    const challengeData = JSON.parse(match[1]);
    const challenge = challengeData.challenge;
    const difficulty = challengeData.rules.difficulty;
    const randomData = challenge.randomData;

    console.log(`Anubis: difficulty=${difficulty}, id=${challenge.id}`);

    // 3. Proof-of-Work: SHA-256(randomData + nonce)
    const prefix = "0".repeat(difficulty);
    let nonce = 0;
    let hash = "";
    const startTime = Date.now();

    while (nonce < 10_000_000) {
      hash = crypto
        .createHash("sha256")
        .update(randomData + nonce.toString())
        .digest("hex");
      if (hash.startsWith(prefix)) break;
      nonce++;
    }

    const elapsedTime = Date.now() - startTime;
    console.log(
      `Anubis: yechildi! nonce=${nonce}, hash=${hash.slice(0, 16)}..., ${elapsedTime}ms`,
    );

    // 4. GET so'rov bilan yechimni yuborish (cookie'larni ham yuborish!)
    const passUrl = new URL(
      "https://unsplash.com/.within.website/x/cmd/anubis/api/pass-challenge",
    );
    passUrl.searchParams.set("id", challenge.id);
    passUrl.searchParams.set("response", hash);
    passUrl.searchParams.set("nonce", nonce.toString());
    passUrl.searchParams.set("redir", redir);
    passUrl.searchParams.set("elapsedTime", elapsedTime.toString());

    const passHeaders: Record<string, string> = {
      "User-Agent": USER_AGENT,
    };
    if (pageCookies) {
      passHeaders.cookie = pageCookies;
    }

    console.log(`Anubis: pass-challenge URL: ${passUrl.toString()}`);
    const passRes = await fetch(passUrl.toString(), {
      headers: passHeaders,
      redirect: "manual",
    });

    console.log(`Anubis: pass-challenge status=${passRes.status}`);

    // 5. Cookie ni olish (302 redirect bilan keladi)
    const allPassCookies = extractCookies(passRes.headers);
    console.log(
      `Anubis: pass-challenge cookie'lari: ${allPassCookies || "(yo'q)"}`,
    );

    const authMatch = allPassCookies.match(
      /techaro\.lol-anubis-auth=([^\s;]+)/,
    );

    if (authMatch) {
      const cookie = `techaro.lol-anubis-auth=${authMatch[1]}`;
      console.log("Anubis: cookie olindi!");
      cachedAnubisCookie = cookie;
      cookieExpiresAt = Date.now() + 60 * 60 * 1000;
      return cookie;
    }

    const body = await passRes.text();
    console.log("Anubis: pass-challenge javob:", body.slice(0, 500));
    return null;
  } catch (err) {
    console.log("Anubis xatolik:", err);
    return null;
  }
}

async function getAnubisCookie(): Promise<string | null> {
  if (cachedAnubisCookie && Date.now() < cookieExpiresAt) {
    return cachedAnubisCookie;
  }
  return await solveAnubisChallenge();
}

const fetchImages = async (phrase: string) => {
  const url = `https://unsplash.com/ngetty/v3/search/images/creative?exclude_editorial_use_only=true&exclude_nudity=true&fields=display_set%2Creferral_destinations%2Ctitle&graphical_styles=photography&page_size=28&phrase=${encodeURIComponent(phrase)}&sort_order=best_match`;

  const anubisCookie = await getAnubisCookie();
  if (!anubisCookie) {
    console.log("Anubis: cookie olinmadi, so'rov yuborilmaydi");
    return null;
  }

  const headers: Record<string, string> = {
    ...UNSPLASH_HEADERS,
    cookie: anubisCookie,
  };

  const data = await fetch(url, { method: "GET", headers, redirect: "manual" });

  if (data.status === 307) {
    console.log("Anubis: cookie eskirgan, qayta yechilmoqda...");
    cachedAnubisCookie = null;
    cookieExpiresAt = 0;
    const newCookie = await solveAnubisChallenge();
    if (!newCookie) return null;

    headers.cookie = newCookie;
    const retry = await fetch(url, {
      method: "GET",
      headers,
      redirect: "manual",
    });
    if (!retry.ok) return null;
    return await retry.json();
  }

  if (!data.ok) {
    console.log(`Unsplash API error: ${data.status}`);
    return null;
  }

  const contentType = data.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    console.log(`Unsplash non-JSON: ${contentType}`);
    return null;
  }

  return await data.json();
};

const getImageUri = (response: any, i: number): string | undefined => {
  const displaySizes = response?.images?.[i]?.display_sizes;
  if (!displaySizes?.length) return undefined;
  return displaySizes.length >= 3 ? displaySizes[2]?.uri : displaySizes[0]?.uri;
};

// Moderatsiya uchun bir nechta nomzod URI yig'amiz: agar bir rasm
// NSFW deb topilsa, keyingisi sinab ko'riladi (start indeksdan aylanma).
const collectCandidateUris = (
  response: any,
  start: number,
  count: number,
): string[] => {
  const uris: string[] = [];
  const images = response?.images;
  if (!Array.isArray(images) || images.length === 0) return uris;

  for (let offset = 0; offset < images.length; offset++) {
    const idx = (start + offset) % images.length;
    const uri = getImageUri(response, idx);
    if (uri && !uris.includes(uri)) uris.push(uri);
    if (uris.length >= count) break;
  }
  return uris;
};

const downloadImageBytes = async (
  uri: string,
  timeoutMs: number = 20_000,
): Promise<Buffer | null> => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(uri, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.log("Unsplash: rasm yuklashda xato:", err);
    return null;
  }
};

/**
 * Mavzu bo'yicha xavfsiz rasm qidiradi va URL qaytaradi.
 *
 * Ikki qatlamli himoya (Python `aiSlidebot` logikasidan ko'chirildi):
 *   1. Unsplash `exclude_nudity=true` — manbada filtrlash
 *   2. NudeNet (Python worker) moderatsiyasi — yuklab olingan rasmni tekshirish
 *
 * Agar rasm NSFW deb topilsa, keyingi nomzod sinab ko'riladi (maxCandidates gacha).
 */
// Neutral, known-safe image used when nothing safe is found.
const FALLBACK_IMAGE =
  "https://media.istockphoto.com/id/2148149010/photo/shah-i-zinda-samarkand-uzbekistan.jpg?a=1&b=1&s=612x612&w=0&k=20&c=axluvJXi7WKg_CvMizCfmf4Nw5LowPbjRu7rKBYun30=";

export const searchImages = async (
  query: string,
  i: number = 1,
  maxCandidates: number = 4,
): Promise<string> => {
  try {
    return (await searchSafeImage(query, i, maxCandidates)) ?? FALLBACK_IMAGE;
  } catch (error) {
    console.error("Error in searchImages:", error);
    return FALLBACK_IMAGE;
  }
};

const searchSafeImage = async (
  query: string,
  i: number,
  maxCandidates: number,
): Promise<string | undefined> => {
  const response = await fetchImages(query);
  let candidates = response ? collectCandidateUris(response, i, maxCandidates) : [];

  if (candidates.length === 0) {
    const fallback = await fetchImages("cyber_security");
    candidates = fallback ? collectCandidateUris(fallback, i, maxCandidates) : [];
  }

  if (candidates.length === 0) {
    console.log(`Unsplash: '${query}' uchun rasm topilmadi`);
    return undefined;
  }

  // Har bir nomzodni: yuklab olish -> moderatsiya -> xavfsiz bo'lsa URL qaytarish
  for (let n = 0; n < candidates.length; n++) {
    const uri = candidates[n];
    const bytes = await downloadImageBytes(uri);
    if (!bytes) continue;

    const safe = await isImageSafe(bytes);
    if (!safe) {
      console.log(`Unsplash: nomzod #${n + 1} rad etildi (NSFW), keyingisi sinaladi`);
      continue;
    }
    return uri;
  }

  console.log(
    `Unsplash: '${query}' uchun xavfsiz rasm topilmadi (${candidates.length} nomzod tekshirildi)`,
  );
  return undefined;
};
