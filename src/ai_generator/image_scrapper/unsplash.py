"""
Unsplash rasm qidiruvi — xavfsiz (nudity filtrli) rasmlar.

Bu modul `searchImages.service.ts` (Node.js) logikasining Python portidir.
Bing scraper (adult_filter_off=True) o'rniga ishlatiladi — 18+ rasmlar
muammosini hal qiladi.

Unsplash `exclude_nudity=true` parametri bilan qidiradi va Anubis
proof-of-work challenge'ni yechib, cookie oladi.

Asosiy funksiya:
    search_image(query, index=1) -> bytes | None   (rasm baytlari)
"""
import asyncio
import hashlib
import json
import re
import time
import urllib.parse

from aiohttp import ClientSession, ClientTimeout

try:
    from image_moderation import is_image_safe
except ImportError:
    from .image_moderation import is_image_safe


def _detect_image_format(data: bytes):
    """Magic bytes orqali rasm formatini aniqlaydi (imghdr Python 3.13'da yo'q)."""
    if len(data) < 12:
        return None
    if data[:3] == b"\xff\xd8\xff":
        return "jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "gif"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    if data[:2] == b"BM":
        return "bmp"
    return None

USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
)

UNSPLASH_HEADERS = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "User-Agent": USER_AGENT,
    "sec-ch-ua": '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "Referer": "https://unsplash.com/s/photos/technology",
    "Referrer-Policy": "origin-when-cross-origin",
}

# Cookie'ni protsess davomida cache qilamiz (1 soat)
_cached_cookie = None
_cookie_expires_at = 0.0

SUPPORTED_FORMATS = ["jpeg", "png", "gif", "webp"]


def _extract_cookies(response) -> str:
    """aiohttp response'dan barcha Set-Cookie larni 'name=val; name2=val2' ko'rinishida oladi."""
    cookies = []
    # aiohttp bir nechta Set-Cookie header'ni getall bilan qaytaradi
    set_cookies = response.headers.getall("Set-Cookie", [])
    for sc in set_cookies:
        name_val = sc.split(";")[0].strip()
        if name_val:
            cookies.append(name_val)
    return "; ".join(cookies)


async def _solve_anubis_challenge(session: ClientSession):
    """Anubis proof-of-work challenge'ni yechadi va auth cookie qaytaradi."""
    global _cached_cookie, _cookie_expires_at
    try:
        redir = "/ngetty/v3/search/images/creative"
        challenge_url = (
            "https://unsplash.com/.within.website?redir="
            + urllib.parse.quote(redir, safe="")
        )

        # 1. Challenge sahifasini olish
        async with session.get(
            challenge_url,
            headers={"User-Agent": USER_AGENT},
            allow_redirects=True,
        ) as page:
            print(f"Anubis: challenge sahifa status={page.status}", flush=True)
            page_cookies = _extract_cookies(page)
            html = await page.text()

        # 2. Challenge JSON ni ajratib olish
        match = re.search(
            r'<script id="anubis_challenge" type="application/json">([\s\S]*?)</script>',
            html,
        )
        if not match:
            print("Anubis: challenge topilmadi HTML dan", flush=True)
            return None

        challenge_data = json.loads(match.group(1))
        challenge = challenge_data["challenge"]
        difficulty = challenge_data["rules"]["difficulty"]
        random_data = challenge["randomData"]

        print(f"Anubis: difficulty={difficulty}, id={challenge['id']}", flush=True)

        # 3. Proof-of-Work: SHA-256(randomData + nonce)
        prefix = "0" * difficulty
        nonce = 0
        hash_hex = ""
        start_time = time.time()

        while nonce < 10_000_000:
            hash_hex = hashlib.sha256(
                (random_data + str(nonce)).encode("utf-8")
            ).hexdigest()
            if hash_hex.startswith(prefix):
                break
            nonce += 1

        elapsed_ms = int((time.time() - start_time) * 1000)
        print(
            f"Anubis: yechildi! nonce={nonce}, hash={hash_hex[:16]}..., {elapsed_ms}ms",
            flush=True,
        )

        # 4. Yechimni yuborish
        pass_params = {
            "id": challenge["id"],
            "response": hash_hex,
            "nonce": str(nonce),
            "redir": redir,
            "elapsedTime": str(elapsed_ms),
        }
        pass_url = (
            "https://unsplash.com/.within.website/x/cmd/anubis/api/pass-challenge?"
            + urllib.parse.urlencode(pass_params)
        )

        pass_headers = {"User-Agent": USER_AGENT}
        if page_cookies:
            pass_headers["cookie"] = page_cookies

        async with session.get(
            pass_url, headers=pass_headers, allow_redirects=False
        ) as pass_res:
            print(f"Anubis: pass-challenge status={pass_res.status}", flush=True)
            all_pass_cookies = _extract_cookies(pass_res)

        auth_match = re.search(
            r"techaro\.lol-anubis-auth=([^\s;]+)", all_pass_cookies
        )
        if auth_match:
            cookie = f"techaro.lol-anubis-auth={auth_match.group(1)}"
            print("Anubis: cookie olindi!", flush=True)
            _cached_cookie = cookie
            _cookie_expires_at = time.time() + 60 * 60  # 1 soat
            return cookie

        print("Anubis: auth cookie topilmadi", flush=True)
        return None
    except Exception as e:
        print(f"Anubis xatolik: {e}", flush=True)
        return None


async def _get_anubis_cookie(session: ClientSession):
    global _cached_cookie, _cookie_expires_at
    if _cached_cookie and time.time() < _cookie_expires_at:
        return _cached_cookie
    return await _solve_anubis_challenge(session)


async def _fetch_images(session: ClientSession, phrase: str):
    """Unsplash ngetty API'dan rasm metadata qaytaradi (JSON)."""
    global _cached_cookie, _cookie_expires_at

    url = (
        "https://unsplash.com/ngetty/v3/search/images/creative"
        "?exclude_editorial_use_only=true&exclude_nudity=true"
        "&fields=display_set%2Creferral_destinations%2Ctitle"
        "&graphical_styles=photography&page_size=28&phrase="
        + urllib.parse.quote(phrase, safe="")
        + "&sort_order=best_match"
    )

    cookie = await _get_anubis_cookie(session)
    if not cookie:
        print("Anubis: cookie olinmadi, so'rov yuborilmaydi", flush=True)
        return None

    headers = dict(UNSPLASH_HEADERS)
    headers["cookie"] = cookie

    async with session.get(url, headers=headers, allow_redirects=False) as resp:
        # 307 — cookie eskirgan, qayta yechamiz
        if resp.status == 307:
            print("Anubis: cookie eskirgan, qayta yechilmoqda...", flush=True)
            _cached_cookie = None
            _cookie_expires_at = 0.0
            new_cookie = await _solve_anubis_challenge(session)
            if not new_cookie:
                return None
            headers["cookie"] = new_cookie
            async with session.get(
                url, headers=headers, allow_redirects=False
            ) as retry:
                if retry.status != 200:
                    return None
                return await retry.json()

        if resp.status != 200:
            print(f"Unsplash API error: {resp.status}", flush=True)
            return None

        content_type = resp.headers.get("content-type", "")
        if "application/json" not in content_type:
            print(f"Unsplash non-JSON: {content_type}", flush=True)
            return None

        return await resp.json()


def _get_image_uri(response, i: int):
    """JSON javobdan i-rasmning URI'sini oladi (eng katta o'lcham yoki birinchi)."""
    try:
        images = response.get("images", [])
        if i >= len(images):
            i = 0
        display_sizes = images[i].get("display_sizes", [])
        if not display_sizes:
            return None
        if len(display_sizes) >= 3:
            return display_sizes[2].get("uri")
        return display_sizes[0].get("uri")
    except Exception:
        return None


def _collect_candidate_uris(response, start: int, count: int):
    """
    Moderatsiya uchun bir nechta nomzod rasm URI'larini yig'adi.

    `start` indeksdan boshlab `count` ta URI qaytaradi. Agar bir rasm
    LLM tomonidan rad etilsa, keyingilari sinab ko'riladi.
    """
    uris = []
    try:
        images = response.get("images", [])
        n = len(images)
        if n == 0:
            return uris
        # start dan boshlab aylanma tartibda yig'amiz
        for offset in range(n):
            idx = (start + offset) % n
            uri = _get_image_uri(response, idx)
            if uri and uri not in uris:
                uris.append(uri)
            if len(uris) >= count:
                break
    except Exception:
        pass
    return uris


async def _download_image_bytes(session: ClientSession, uri: str, timeout: int = 20):
    """Rasm URI'sidan baytlarni yuklab oladi va formatini tekshiradi."""
    try:
        async with session.get(
            uri,
            headers={"User-Agent": USER_AGENT},
            timeout=ClientTimeout(total=timeout),
        ) as resp:
            if resp.status != 200:
                return None
            data = await resp.read()

        fmt = _detect_image_format(data)
        if fmt not in SUPPORTED_FORMATS:
            print(f"Unsplash: qo'llab-quvvatlanmaydigan format: {fmt}", flush=True)
            return None
        return data
    except Exception as e:
        print(f"Unsplash: rasm yuklashda xato: {e}", flush=True)
        return None


async def search_image(
    query: str,
    index: int = 1,
    timeout: int = 20,
    moderate: bool = True,
    max_candidates: int = 6,
):
    """
    Mavzu bo'yicha xavfsiz rasm qidiradi va baytlarini qaytaradi.

    Ikki qatlamli himoya:
      1. Unsplash `exclude_nudity=true` — manbada filtrlash
      2. LLM vision moderatsiyasi — yuklab olingan rasmni tekshirish

    Agar rasm LLM tomonidan rad etilsa, keyingi nomzod sinab ko'riladi
    (max_candidates gacha).

    Args:
        query: qidiruv kalit so'zi
        index: nechanchi rasmdan boshlash (0-asosli, default 1)
        timeout: rasm yuklab olish timeout (sekund)
        moderate: LLM moderatsiyasini yoqish/o'chirish
        max_candidates: nechta nomzodni sinab ko'rish

    Returns:
        bytes | None — xavfsiz rasm baytlari yoki topilmasa None
    """
    async with ClientSession() as session:
        response = await _fetch_images(session, query)
        candidates = (
            _collect_candidate_uris(response, index, max_candidates)
            if response
            else []
        )

        # Fallback — topilmasa umumiy mavzu
        if not candidates:
            fallback = await _fetch_images(session, "education")
            candidates = (
                _collect_candidate_uris(fallback, index, max_candidates)
                if fallback
                else []
            )

        if not candidates:
            print(f"Unsplash: '{query}' uchun rasm topilmadi", flush=True)
            return None

        # Har bir nomzodni: yuklab olish → moderatsiya → xavfsiz bo'lsa qaytarish
        for n, uri in enumerate(candidates):
            data = await _download_image_bytes(session, uri, timeout)
            if not data:
                continue

            if moderate:
                safe = await is_image_safe(data)
                if not safe:
                    print(
                        f"Unsplash: nomzod #{n + 1} rad etildi, keyingisi sinaladi",
                        flush=True,
                    )
                    continue

            return data

        print(
            f"Unsplash: '{query}' uchun xavfsiz rasm topilmadi ({len(candidates)} nomzod tekshirildi)",
            flush=True,
        )
        return None


# Test
if __name__ == "__main__":
    async def _test():
        data = await search_image("mountain landscape", 1)
        if data:
            print(f"OK: {len(data)} bayt yuklandi")
            with open("test_unsplash.jpg", "wb") as f:
                f.write(data)
        else:
            print("FAIL: rasm topilmadi")

    asyncio.run(_test())
