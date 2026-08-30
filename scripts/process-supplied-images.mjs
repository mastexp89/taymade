import sharp from "sharp";
import { mkdir, rm, stat } from "node:fs/promises";

// Blank preview bases (no printed text) -> public/products/blanks/<slug>.jpg
const BLANKS = {
  "ChatGPT Image Aug 30, 2026, 09_41_27 AM (1).png": "personalised-water-bottle",
  "ChatGPT Image Aug 30, 2026, 09_41_28 AM (2).png": "custom-tumbler",
  "ChatGPT Image Aug 30, 2026, 09_41_28 AM (3).png": "personalised-mug",
  "ChatGPT Image Aug 30, 2026, 09_41_29 AM (4).png": "custom-t-shirt",
  "ChatGPT Image Aug 30, 2026, 09_41_29 AM (5).png": "personalised-hoodie",
  "ChatGPT Image Aug 30, 2026, 09_41_29 AM (6).png": "custom-phone-case",
  "ChatGPT Image Aug 30, 2026, 09_41_30 AM (7).png": "custom-keyring",
  "ChatGPT Image Aug 30, 2026, 09_41_30 AM (8).png": "personalised-coasters",
  "ChatGPT Image Aug 30, 2026, 09_41_31 AM (9).png": "kids-personalised-t-shirt",
  "ChatGPT Image Aug 30, 2026, 09_41_31 AM (10).png": "personalised-tote-bag",
  "ChatGPT Image Aug 30, 2026, 09_44_46 AM (1).png": "acrylic-family-sign",
  "ChatGPT Image Aug 30, 2026, 09_44_46 AM (2).png": "wedding-heart-sign",
  "ChatGPT Image Aug 30, 2026, 09_44_46 AM (3).png": "custom-golf-balls",
  "ChatGPT Image Aug 30, 2026, 09_44_47 AM (4).png": "custom-pen",
  "ChatGPT Image Aug 30, 2026, 09_44_47 AM (5).png": "personalised-baby-grow",
};

// Real product photos (with example personalisation) -> public/products/<name>.jpg
const REALS = {
  "ChatGPT Image Aug 30, 2026, 09_44_47 AM (6).png": "custom-phone-case",
  "ChatGPT Image Aug 30, 2026, 09_44_48 AM (7).png": "custom-pen",
  "ChatGPT Image Aug 30, 2026, 09_44_48 AM (8).png": "custom-golf-balls",
  "ChatGPT Image Aug 30, 2026, 09_44_48 AM (9).png": "custom-keyring",
  "ChatGPT Image Aug 30, 2026, 09_44_48 AM (10).png": "personalised-coasters",
};

await mkdir("public/products/blanks", { recursive: true });
let before = 0, after = 0, n = 0;

async function process(src, outPath) {
  before += (await stat(src)).size;
  await sharp(src).resize({ width: 800, height: 800, fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toFile(outPath);
  after += (await stat(outPath)).size;
  await rm(src, { force: true });
  n++;
}

for (const [src, slug] of Object.entries(BLANKS)) await process(src, `public/products/blanks/${slug}.jpg`);
for (const [src, slug] of Object.entries(REALS)) await process(src, `public/products/${slug}.jpg`);

console.log(`Processed ${n} images: ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB`);
