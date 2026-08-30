import sharp from "sharp";
import { readdir, stat, rename } from "node:fs/promises";
import { join } from "node:path";

const dir = "public/products";
const files = (await readdir(dir)).filter((f) => f.endsWith(".png"));
let before = 0, after = 0;
for (const f of files) {
  const p = join(dir, f);
  before += (await stat(p)).size;
  const isHero = f.startsWith("hero-");
  const tmp = join(dir, `__${f}`);
  const img = sharp(p).resize({
    width: isHero ? 1600 : 760,
    height: isHero ? undefined : 760,
    fit: "inside",
    withoutEnlargement: true,
  });
  await img.png({ quality: 82, compressionLevel: 9, palette: true }).toFile(tmp);
  await rename(tmp, p);
  after += (await stat(p)).size;
}
console.log(`Optimised ${files.length} images: ${(before/1e6).toFixed(1)}MB -> ${(after/1e6).toFixed(1)}MB`);
