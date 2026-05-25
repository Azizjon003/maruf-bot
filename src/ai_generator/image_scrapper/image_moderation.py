"""
NSFW rasm moderatsiyasi — NudeNet (ONNX) orqali ikkinchi himoya qatlami.

Unsplash allaqachon `exclude_nudity=true` bilan filtrlaydi, lekin har
ehtimolga qarshi yuklab olingan har bir rasmni NudeNet NSFW detection
modeli orqali ham tekshiramiz.

KUCHAYTIRILGAN rejim:
  - Har bir NSFW sinf uchun ALOHIDA (past) ishonch chegarasi — eng ochiq
    sinflar 0.25 da ham rad etiladi (oldin hammasi 0.5 edi).
  - `IMAGE_MODERATION_STRICT=true` bo'lsa, model yuklanmasa yoki xato
    bo'lsa rasm RAD etiladi (fail-closed). Default — fail-open.

Asosiy funksiya:
    is_image_safe(image_bytes) -> bool

Sozlamalar (env):
    IMAGE_MODERATION_ENABLED  — "false" bo'lsa o'chiriladi (default: yoqilgan)
    IMAGE_MODERATION_STRICT   — "true" bo'lsa fail-closed (default: false)
    NUDENET_THRESHOLD         — GLOBAL yuqori chegara: agar berilsa, har
                                qanday NSFW sinfni shu qiymatdan past bo'lsa
                                ham rad etadi (qattiqroq qiladi). Default: ta'sirsiz.
"""
import os
import tempfile

# Moderatsiyani butunlay o'chirish: IMAGE_MODERATION_ENABLED=false
MODERATION_ENABLED = (
    os.environ.get("IMAGE_MODERATION_ENABLED", "true").lower() != "false"
)

# Qat'iy rejim: model ishlamasa/xato bo'lsa rasmni RAD etadi (fail-closed)
STRICT_MODE = os.environ.get("IMAGE_MODERATION_STRICT", "false").lower() == "true"

# GLOBAL yuqori chegara — agar env berilsa, BARCHA NSFW sinflarni shu
# qiymatdan past bo'lsa ham rad etadi (ya'ni umumiy qat'iylikni oshiradi).
# Default 1.0 — ta'sirsiz (per-class chegaralar ishlaydi).
try:
    GLOBAL_MAX_THRESHOLD = float(os.environ["NUDENET_THRESHOLD"])
except (KeyError, ValueError):
    GLOBAL_MAX_THRESHOLD = 1.0

# Har bir NSFW sinf uchun alohida chegara (past = qat'iyroq).
# Bu yerda BO'LMAGAN sinflar (FACE, FEET, BELLY, ARMPITS, COVERED breast/
# buttocks va h.k.) NSFW deb hisoblanmaydi — aks holda oddiy, kiyingan
# odam rasmlari ham rad etilib, rasm umuman topilmay qolardi.
NSFW_CLASS_THRESHOLDS = {
    # Ochiq jinsiy a'zolar / anus — eng qat'iy
    "FEMALE_GENITALIA_EXPOSED": 0.25,
    "MALE_GENITALIA_EXPOSED": 0.25,
    "ANUS_EXPOSED": 0.25,
    # Ko'krak / dumba ochiq
    "FEMALE_BREAST_EXPOSED": 0.30,
    "BUTTOCKS_EXPOSED": 0.30,
    # Yopiq lekin jinsiy a'zo joyi — shubhali
    "FEMALE_GENITALIA_COVERED": 0.40,
    "ANUS_COVERED": 0.45,
}

# Modelni bir marta yuklab, qayta ishlatamiz (lazy singleton)
_detector = None
_detector_failed = False


def _get_detector():
    """NudeDetector'ni lazy yuklaydi. Muvaffaqiyatsiz bo'lsa None."""
    global _detector, _detector_failed
    if _detector is not None:
        return _detector
    if _detector_failed:
        return None
    try:
        from nudenet import NudeDetector

        _detector = NudeDetector()
        print("Moderatsiya: NudeNet modeli yuklandi", flush=True)
        return _detector
    except Exception as e:
        print(f"Moderatsiya: NudeNet yuklab bo'lmadi '{e}'", flush=True)
        _detector_failed = True
        return None


def _effective_threshold(cls: str):
    """Sinf uchun amaldagi chegara. NSFW bo'lmagan sinf uchun None."""
    base = NSFW_CLASS_THRESHOLDS.get(cls)
    if base is None:
        return None
    # Global env chegara qattiqroq bo'lsa (pastroq) — uni qo'llaymiz
    return min(base, GLOBAL_MAX_THRESHOLD)


def _detection_is_nsfw(cls: str, score: float) -> bool:
    """Bitta detection NSFW chegaradan o'tganini aniqlaydi (test qilinadigan yadro)."""
    threshold = _effective_threshold(cls)
    if threshold is None:
        return False
    return score >= threshold


def _check_nsfw(image_path: str):
    """
    Rasmni NudeNet bilan tekshiradi.

    Returns:
        True  — NSFW aniqlandi (rasm NOMAQBUL)
        False — toza
        None  — model mavjud emas (qaror is_image_safe'da olinadi)
    """
    detector = _get_detector()
    if detector is None:
        return None

    detections = detector.detect(image_path)
    for det in detections:
        cls = det.get("class", "")
        score = det.get("score", 0)
        if _detection_is_nsfw(cls, score):
            print(
                f"Moderatsiya: NSFW aniqlandi — {cls} "
                f"(score={score:.2f} >= {_effective_threshold(cls)})",
                flush=True,
            )
            return True
    return False


async def is_image_safe(image_bytes: bytes, timeout: int = 20) -> bool:
    """
    Rasmni NudeNet orqali tekshiradi.

    Returns:
        True  — rasm xavfsiz
        False — NSFW aniqlandi (yoki STRICT rejimda tekshirib bo'lmadi)

    Fail-open (default): model yuklanmasa/xato bo'lsa True (Unsplash filtri bor).
    Fail-closed (IMAGE_MODERATION_STRICT=true): bunday holatda False.
    """
    if not MODERATION_ENABLED:
        return True

    if not image_bytes or len(image_bytes) < 100:
        return True

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
            f.write(image_bytes)
            tmp_path = f.name

        result = _check_nsfw(tmp_path)

        if result is None:
            # Model mavjud emas
            if STRICT_MODE:
                print("Moderatsiya: [RAD] model yo'q + STRICT rejim", flush=True)
                return False
            return True  # fail-open

        if result:
            print("Moderatsiya: [RAD] rasm rad etildi (NSFW)", flush=True)
            return False

        print("Moderatsiya: [OK] rasm xavfsiz", flush=True)
        return True

    except Exception as e:
        if STRICT_MODE:
            print(f"Moderatsiya: [RAD] xato '{e}' + STRICT rejim", flush=True)
            return False
        print(f"Moderatsiya: xato '{e}' — fail-open", flush=True)
        return True
    finally:
        if tmp_path:
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
