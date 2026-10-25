"""
Downloads real images for borderline-but-clean slide topics (beach, sport,
medicine, art) without the filter, so check_images.py can show whether the
filter wrongly blocks normal educational pictures.

    python3 tests/fetch_borderline.py <out_folder>
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "ai_generator", "image_scrapper"))
import unsplash  # noqa: E402

TOPICS = [
    "beach vacation family", "swimming competition", "gymnastics athlete",
    "ballet dancer", "doctor examining patient", "human anatomy education",
    "classical marble sculpture", "fitness gym workout", "summer pool party",
    "mother and baby", "fashion model portrait", "yoga class",
]


async def main(out):
    os.makedirs(out, exist_ok=True)
    for i, topic in enumerate(TOPICS):
        data = await unsplash.search_image(topic, index=1, moderate=False)
        if data:
            name = f"{i:02d}_{topic.replace(' ', '_')}.jpg"
            open(os.path.join(out, name), "wb").write(data)
            print("saved", name)
        else:
            print("no image for", topic)


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1]))
