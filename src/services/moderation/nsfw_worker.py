"""
NSFW rasm moderatsiyasi — doimiy worker (NudeNet / ONNX).

Bu skript Node.js (`imageModeration.ts`) tomonidan bir marta ishga
tushiriladi va jarayon davomida ochiq qoladi. Model faqat bir marta
yuklanadi (har bir rasm uchun qayta yuklanmaydi — bu tezlikni oshiradi).

Protokol (qator asosida, stdin/stdout):
    Node  -> worker : <base64 rasm baytlari>\n
    worker -> Node  : SAFE | UNSAFE | ERROR\n

Sozlamalar (env):
    NUDENET_THRESHOLD — aniqlik chegarasi (default: 0.5)

Eslatma: model yuklanmasa "fail-open" — ya'ni SAFE qaytaradi, chunki
Unsplash allaqachon `exclude_nudity=true` bilan filtrlagan; generatsiyani
butunlay to'xtatib qo'ymaslik uchun.
"""
import base64
import os
import sys
import tempfile

# GLOBAL yuqori chegara — env berilsa BARCHA NSFW sinflarni shu qiymatdan
# past bo'lsa ham rad etadi (qattiqroq qiladi). Default 1.0 — ta'sirsiz.
try:
    GLOBAL_MAX_THRESHOLD = float(os.environ["NUDENET_THRESHOLD"])
except (KeyError, ValueError):
    GLOBAL_MAX_THRESHOLD = 1.0

# Har bir NSFW sinf uchun alohida (past) chegara — eng ochiq sinflar
# 0.25 da ham rad etiladi. Bu yerda bo'lmagan sinflar NSFW emas.
NSFW_CLASS_THRESHOLDS = {
    "FEMALE_GENITALIA_EXPOSED": 0.25,
    "MALE_GENITALIA_EXPOSED": 0.25,
    "ANUS_EXPOSED": 0.25,
    "FEMALE_BREAST_EXPOSED": 0.30,
    "BUTTOCKS_EXPOSED": 0.30,
    "FEMALE_GENITALIA_COVERED": 0.40,
    "ANUS_COVERED": 0.45,
}


def _effective_threshold(cls: str):
    base = NSFW_CLASS_THRESHOLDS.get(cls)
    if base is None:
        return None
    return min(base, GLOBAL_MAX_THRESHOLD)


def _log(msg: str) -> None:
    """Diagnostika xabarlari stderr'ga — stdout faqat protokol uchun."""
    print(msg, file=sys.stderr, flush=True)


def _load_detector():
    """NudeDetector'ni yuklaydi. Muvaffaqiyatsiz bo'lsa None (fail-open)."""
    try:
        from nudenet import NudeDetector

        detector = NudeDetector()
        _log("nsfw_worker: NudeNet modeli yuklandi")
        return detector
    except Exception as e:  # noqa: BLE001
        _log(f"nsfw_worker: NudeNet yuklab bo'lmadi '{e}' — fail-open")
        return None


def _is_nsfw(detector, image_path: str) -> bool:
    """True — NSFW aniqlandi (nomaqbul); False — toza."""
    detections = detector.detect(image_path)
    for det in detections:
        cls = det.get("class", "")
        score = det.get("score", 0)
        threshold = _effective_threshold(cls)
        if threshold is not None and score >= threshold:
            _log(f"nsfw_worker: NSFW aniqlandi — {cls} (score={score:.2f} >= {threshold})")
            return True
    return False


def _check_b64(detector, b64: str) -> str:
    """Bitta base64 rasmni tekshiradi -> 'SAFE' | 'UNSAFE' | 'ERROR'."""
    if detector is None:
        return "SAFE"  # model yo'q — fail-open
    tmp_path = None
    try:
        data = base64.b64decode(b64)
        if not data or len(data) < 100:
            return "SAFE"
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
            f.write(data)
            tmp_path = f.name
        return "UNSAFE" if _is_nsfw(detector, tmp_path) else "SAFE"
    except Exception as e:  # noqa: BLE001
        _log(f"nsfw_worker: tekshirishda xato '{e}' — fail-open")
        return "SAFE"  # fail-open
    finally:
        if tmp_path:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


def main() -> None:
    detector = _load_detector()
    # Tayyorlikni bildirish (Node kutib turishi mumkin)
    print("READY", flush=True)
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        sys.stdout.write(_check_b64(detector, line) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
