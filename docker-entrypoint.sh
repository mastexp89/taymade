#!/bin/sh
set -e

echo "▸ Applying database migrations..."
npx prisma migrate deploy

echo "▸ Seeding (safe to re-run — won't overwrite your data)..."
npm run db:seed || echo "  seed step skipped/failed — continuing"

echo "▸ Starting TayMade on :3000"
exec node_modules/.bin/next start -H 0.0.0.0 -p 3000
