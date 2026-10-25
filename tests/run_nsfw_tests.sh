#!/bin/sh
# Runs all NSFW filter tests inside the running maruf-bot container.
# Usage (on the server):  sh tests/run_nsfw_tests.sh [folder_with_18+_samples]
set -e
cd "$(dirname "$0")/.."
C=maruf-bot

docker exec $C rm -rf /app/tests
docker cp tests $C:/app/tests

echo "== 1. Python filter logic"
docker exec -w /app $C python3 -m unittest discover -s tests -p "test_*.py"

echo "== 2. TS filter logic + real worker"
docker exec -w /app $C npx ts-node --transpile-only tests/searchImages.filter.test.ts

echo "== 3. Real model on clean borderline images (should all be SAFE)"
docker exec -w /app $C sh -c "python3 tests/fetch_borderline.py /tmp/borderline > /dev/null && python3 tests/check_images.py /tmp/borderline --expect safe" 2>&1 \
  | grep -v "^Moderatsiya" || true

if [ -n "$1" ]; then
  echo "== 4. Real model on your 18+ samples (should all be UNSAFE)"
  docker exec $C rm -rf /tmp/nsfw_samples
  docker cp "$1" $C:/tmp/nsfw_samples
  docker exec -w /app $C python3 tests/check_images.py /tmp/nsfw_samples --expect unsafe 2>&1 | grep -v "^Moderatsiya"
  docker exec $C rm -rf /tmp/nsfw_samples
fi

docker exec $C rm -rf /app/tests /tmp/borderline
