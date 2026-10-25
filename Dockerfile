FROM node:20-bookworm-slim

# OpenSSL for Prisma, Python for slide/referat generators and NSFW moderation
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     openssl ca-certificates python3 python3-venv libgl1 libglib2.0-0 \
  && rm -rf /var/lib/apt/lists/*

# Python deps live in a venv; putting it first on PATH makes `python3` use it
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir aiohttp nudenet python-pptx python-docx \
  && python3 -c "from nudenet import NudeDetector; NudeDetector()"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

ENV NODE_ENV=production \
    PYTHON_BIN=python3

# Python scripts use paths relative to /app, so the bot must run from here
CMD ["sh", "-c", "npx prisma db push --skip-generate && node prisma/seed.js && npx ts-node --transpile-only src/main.ts"]
