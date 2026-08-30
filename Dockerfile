# TayMade — production image (Next.js + Prisma).
FROM node:22-bookworm-slim

WORKDIR /app

# Prisma needs OpenSSL at build + runtime.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install deps (dev deps needed for the build + prisma + seed).
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# App source.
COPY . .

# Dummy DATABASE_URL just so `prisma generate` / `next build` don't complain;
# the real one is injected at runtime by docker-compose.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

RUN chmod +x docker-entrypoint.sh
CMD ["./docker-entrypoint.sh"]
