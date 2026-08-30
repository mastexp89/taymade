import sharp from "sharp";
import { mkdir, readdir, stat, rm, rename } from "node:fs/promises";
import { join } from "node:path";

const catMap = {
  "personalised_gifts_1024.jpg": "personalised-gifts.jpg",
  "clothing_1024.jpg": "clothing.jpg",
  "business_printing_1024.jpg": "business-printing.jpg",
  "nfc_qr_products_1024.jpg": "nfc-qr.jpg",
  "bottles_tumblers_1024.jpg": "bottles-tumblers.jpg",
  "weddings_1024.jpg": "weddings.jpg",
  "sports_clubs_1024.jpg": "sports-clubs.jpg",
  "uv_dtf_transfers_1024.jpg": "uv-dtf.jpg",
};

await mkdir("public/categories", { recursive: true });
await mkdir("public/icons/how", { recursive: true });
await mkdir("public/icons/feature", { recursive: true });
await mkdir("public/icons/category", { recursive: true });

let before = 0, after = 0;
// category lifestyle images -> resize + jpeg compress
for (const [src, dst] of Object.entries(catMap)) {
  const p = join("category_images", src);
  before += (await stat(p)).size;
  await sharp(p).resize({ width: 720, height: 720, fit: "cover" }).jpeg({ quality: 80, mozjpeg: true }).toFile(join("public/categories", dst));
  after += (await stat(join("public/categories", dst))).size;
}

// icon sets -> resize to 160, keep transparency (png)
async function icons(srcDir, dstDir) {
  for (const file of await readdir(srcDir)) {
    if (!file.endsWith(".png")) continue;
    const dst = file.replaceAll("_", "-");
    const p = join(srcDir, file);
    before += (await stat(p)).size;
    await sharp(p).resize({ width: 160, height: 160, fit: "inside" }).png({ compressionLevel: 9, palette: true }).toFile(join(dstDir, dst));
    after += (await stat(join(dstDir, dst))).size;
  }
}
await icons("how_it_works_png", "public/icons/how");
await icons("feature_icons_png", "public/icons/feature");
await icons("category_icons_png", "public/icons/category");

// remove source folders
for (const d of ["category_images", "how_it_works_png", "feature_icons_png", "category_icons_png"]) {
  await rm(d, { recursive: true, force: true });
}
console.log(`Imported new images: ${(before/1e6).toFixed(1)}MB -> ${(after/1e6).toFixed(1)}MB`);
