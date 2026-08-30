import sharp from "sharp";
import { mkdir, rm, stat } from "node:fs/promises";

const REALS = {
  "ChatGPT Image Aug 30, 2026, 10_30_14 AM (1).png": "printed-workwear",
  "ChatGPT Image Aug 30, 2026, 10_30_14 AM (2).png": "business-branded-bottle",
  "ChatGPT Image Aug 30, 2026, 10_30_14 AM (3).png": "startup-brand-pack",
  "ChatGPT Image Aug 30, 2026, 10_30_15 AM (4).png": "restaurant-nfc-pack",
  "ChatGPT Image Aug 30, 2026, 10_30_15 AM (5).png": "staff-pack",
  "ChatGPT Image Aug 30, 2026, 10_30_15 AM (6).png": "business-starter-pack",
  "ChatGPT Image Aug 30, 2026, 10_30_15 AM (7).png": "kids-personalised-t-shirt",
  "ChatGPT Image Aug 30, 2026, 10_30_16 AM (8).png": "personalised-baby-grow",
  "ChatGPT Image Aug 30, 2026, 10_30_16 AM (9).png": "personalised-tote-bag",
};
const BLANKS = {
  "ChatGPT Image Aug 30, 2026, 10_30_16 AM (10).png": "football-shirt",
};

await mkdir("public/products/blanks", { recursive: true });
let before = 0, after = 0, n = 0;
async function go(src, out) {
  before += (await stat(src)).size;
  await sharp(src).resize({ width: 800, height: 800, fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  after += (await stat(out)).size;
  await rm(src, { force: true });
  n++;
}
for (const [s, slug] of Object.entries(REALS)) await go(s, `public/products/${slug}.jpg`);
for (const [s, slug] of Object.entries(BLANKS)) await go(s, `public/products/blanks/${slug}.jpg`);
console.log(`Processed ${n}: ${(before / 1e6).toFixed(1)}MB -> ${(after / 1e6).toFixed(1)}MB`);
