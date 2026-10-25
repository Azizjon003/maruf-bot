"""
NSFW filtr mantiq testlari (Python yo'li: shablonli slaydlar va Word).

NudeNet modeli o'rniga soxta detector ishlatiladi: u biz bergan natijani
qaytaradi. Shu bilan "model nomaqbul desa, rasm albatta rad etiladimi?"
degan savolni aniq tekshiramiz.

Ishga tushirish (konteyner ichida):  python3 -m unittest discover -s tests -v
"""
import asyncio
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "ai_generator", "image_scrapper"))
import image_moderation as m  # noqa: E402

FAKE_JPEG = b"\xff\xd8\xff" + b"0" * 500


class FakeDetector:
    def __init__(self, detections=None, error=None):
        self.detections = detections or []
        self.error = error

    def detect(self, path):
        if self.error:
            raise self.error
        return self.detections


def run(coro):
    return asyncio.run(coro)


class ThresholdTests(unittest.TestCase):
    def test_every_nsfw_class_rejected_at_threshold(self):
        for cls, threshold in m.NSFW_CLASS_THRESHOLDS.items():
            with self.subTest(cls=cls):
                self.assertTrue(m._detection_is_nsfw(cls, threshold))
                self.assertTrue(m._detection_is_nsfw(cls, 0.99))

    def test_below_threshold_allowed(self):
        for cls, threshold in m.NSFW_CLASS_THRESHOLDS.items():
            with self.subTest(cls=cls):
                self.assertFalse(m._detection_is_nsfw(cls, threshold - 0.01))

    def test_explicit_classes_are_strictest(self):
        for cls in ("FEMALE_GENITALIA_EXPOSED", "MALE_GENITALIA_EXPOSED", "ANUS_EXPOSED"):
            self.assertLessEqual(m.NSFW_CLASS_THRESHOLDS[cls], 0.25)

    def test_normal_body_parts_not_nsfw(self):
        # Kiyingan odam, yuz, oyoq, qorin — oddiy rasmlar rad etilmasligi kerak
        for cls in ("FACE_FEMALE", "FACE_MALE", "FEET_EXPOSED", "BELLY_EXPOSED",
                    "ARMPITS_EXPOSED", "FEMALE_BREAST_COVERED", "BUTTOCKS_COVERED"):
            with self.subTest(cls=cls):
                self.assertFalse(m._detection_is_nsfw(cls, 0.99))


class IsImageSafeTests(unittest.TestCase):
    def setUp(self):
        self._saved = (m._detector, m._detector_failed, m.STRICT_MODE, m.MODERATION_ENABLED)
        m.MODERATION_ENABLED = True
        m.STRICT_MODE = False
        m._detector_failed = False

    def tearDown(self):
        m._detector, m._detector_failed, m.STRICT_MODE, m.MODERATION_ENABLED = self._saved

    def check(self, detections):
        m._detector = FakeDetector(detections)
        return run(m.is_image_safe(FAKE_JPEG))

    def test_exposed_image_rejected(self):
        for cls in ("FEMALE_GENITALIA_EXPOSED", "MALE_GENITALIA_EXPOSED",
                    "FEMALE_BREAST_EXPOSED", "BUTTOCKS_EXPOSED", "ANUS_EXPOSED"):
            with self.subTest(cls=cls):
                self.assertFalse(self.check([{"class": cls, "score": 0.6}]))

    def test_one_bad_detection_among_clean_ones_rejects(self):
        self.assertFalse(self.check([
            {"class": "FACE_FEMALE", "score": 0.95},
            {"class": "BELLY_EXPOSED", "score": 0.8},
            {"class": "FEMALE_BREAST_EXPOSED", "score": 0.35},
        ]))

    def test_clean_image_allowed(self):
        self.assertTrue(self.check([]))
        self.assertTrue(self.check([{"class": "FACE_MALE", "score": 0.97}]))

    def test_strict_mode_rejects_when_model_missing(self):
        m._detector = None
        m._detector_failed = True
        m.STRICT_MODE = True
        self.assertFalse(run(m.is_image_safe(FAKE_JPEG)))

    def test_strict_mode_rejects_on_detector_error(self):
        m._detector = FakeDetector(error=RuntimeError("boom"))
        m.STRICT_MODE = True
        self.assertFalse(run(m.is_image_safe(FAKE_JPEG)))

    def test_default_mode_fails_open_on_error(self):
        # Default: model xato bersa rasm o'tadi (Unsplash filtri birinchi qatlam)
        m._detector = FakeDetector(error=RuntimeError("boom"))
        self.assertTrue(run(m.is_image_safe(FAKE_JPEG)))


if __name__ == "__main__":
    unittest.main(verbosity=2)
