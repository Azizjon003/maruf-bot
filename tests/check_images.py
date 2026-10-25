"""
Real NudeNet check on image files — shows what the filter decides and why.

    python3 tests/check_images.py <folder> [--expect unsafe|safe]

Put your own 18+ sample images in a folder and run with --expect unsafe:
the script exits with an error if any of them would pass the filter.
Run with --expect safe on normal images to catch false positives.
"""
import argparse
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "ai_generator", "image_scrapper"))
import image_moderation as m  # noqa: E402

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--expect", choices=["safe", "unsafe"])
    args = ap.parse_args()

    files = sorted(
        os.path.join(args.folder, f) for f in os.listdir(args.folder)
        if os.path.splitext(f)[1].lower() in EXTS
    )
    if not files:
        sys.exit(f"No images in {args.folder}")

    detector = m._get_detector()
    if detector is None:
        sys.exit("NudeNet model could not be loaded")

    wrong = 0
    for path in files:
        detections = detector.detect(path)
        hits = [d for d in detections if m._detection_is_nsfw(d["class"], d["score"])]
        safe = asyncio.run(m.is_image_safe(open(path, "rb").read()))
        verdict = "SAFE  " if safe else "UNSAFE"
        top = ", ".join(f'{d["class"]}={d["score"]:.2f}' for d in sorted(detections, key=lambda d: -d["score"])[:4])
        print(f"{verdict} {os.path.basename(path)}  [{top or 'no detections'}]")
        if hits:
            print("         rejected by: " + ", ".join(d["class"] for d in hits))
        if args.expect and (safe != (args.expect == "safe")):
            wrong += 1

    if args.expect:
        print(f"\n{len(files) - wrong}/{len(files)} as expected ({args.expect})")
        sys.exit(1 if wrong else 0)


if __name__ == "__main__":
    main()
