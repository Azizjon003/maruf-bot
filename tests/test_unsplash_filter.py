"""
Python rasm qidiruvi (unsplash.search_image) filtr bilan to'g'ri ishlashini
tekshiradi: rad etilgan rasm hech qachon qaytarilmaydi, keyingi nomzod olinadi.
Tarmoq ishlatilmaydi — qidiruv va yuklab olish soxta.
"""
import asyncio
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "ai_generator", "image_scrapper"))
import unsplash  # noqa: E402


def fake_response(n):
    return {"images": [{"display_sizes": [{"uri": f"https://img/{i}"}]} for i in range(n)]}


class SearchImageFilterTests(unittest.TestCase):
    def setUp(self):
        self._saved = (unsplash._fetch_images, unsplash._download_image_bytes, unsplash.is_image_safe)
        self.checked = []

        async def fetch(session, phrase):
            return fake_response(6)

        async def download(session, uri, timeout=20):
            return uri.encode()  # rasm baytlari o'rniga URI

        unsplash._fetch_images = fetch
        unsplash._download_image_bytes = download

    def tearDown(self):
        unsplash._fetch_images, unsplash._download_image_bytes, unsplash.is_image_safe = self._saved

    def set_unsafe(self, bad):
        async def is_safe(data):
            self.checked.append(data.decode())
            return data.decode() not in bad
        unsplash.is_image_safe = is_safe

    def test_rejected_images_are_skipped(self):
        # index=1 dan boshlanadi: img/1, img/2, img/3 ...
        self.set_unsafe({"https://img/1", "https://img/2"})
        result = asyncio.run(unsplash.search_image("test", index=1))
        self.assertEqual(result, b"https://img/3")
        self.assertEqual(self.checked, ["https://img/1", "https://img/2", "https://img/3"])

    def test_all_rejected_returns_nothing(self):
        self.set_unsafe({f"https://img/{i}" for i in range(6)})
        result = asyncio.run(unsplash.search_image("test", index=1))
        self.assertIsNone(result)  # slaydga rasm qo'yilmaydi

    def test_every_returned_image_was_checked(self):
        self.set_unsafe(set())
        result = asyncio.run(unsplash.search_image("test", index=1))
        self.assertIn(result.decode(), self.checked)


if __name__ == "__main__":
    unittest.main(verbosity=2)
