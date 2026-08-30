import { prisma } from "@/lib/prisma";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
]);
const ALLOWED_EXT = /\.(png|jpe?g|webp|svg|pdf)$/i;

export type SavedUpload = { id: string; filename: string; url: string };

export async function saveUpload(
  file: File,
  kind: "LOGO" | "PHOTO" | "ARTWORK" = "ARTWORK",
): Promise<SavedUpload> {
  if (!file || file.size === 0) throw new Error("No file received.");
  if (file.size > MAX_BYTES) throw new Error("File is too large (max 10 MB).");
  if (!ALLOWED_MIME.has(file.type) && !ALLOWED_EXT.test(file.name)) {
    throw new Error("Unsupported file type. Please use PNG, JPG, WEBP, SVG or PDF.");
  }

  const buf = Buffer.from(await file.arrayBuffer());
  await mkdir(UPLOAD_DIR, { recursive: true });

  const rec = await prisma.upload.create({
    data: { url: "", filename: file.name, mime: file.type || null, size: buf.length, kind },
  });
  await writeFile(path.join(UPLOAD_DIR, rec.id), buf); // stored by id, no extension
  const url = `/api/files/${rec.id}`;
  await prisma.upload.update({ where: { id: rec.id }, data: { url } });

  return { id: rec.id, filename: file.name, url };
}

export async function getUploadFile(id: string) {
  const rec = await prisma.upload.findUnique({ where: { id } });
  if (!rec) return null;
  const p = path.join(UPLOAD_DIR, id);
  if (!existsSync(p)) return null;
  return {
    data: await readFile(p),
    mime: rec.mime ?? "application/octet-stream",
    filename: rec.filename ?? id,
  };
}
