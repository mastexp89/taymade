import sharp from "sharp";
import { rm, stat } from "node:fs/promises";

const map = {
  "ChatGPT Image Aug 30, 2026, 08_50_40 AM (1).png": "personalised-gifts.jpg",
  "ChatGPT Image Aug 30, 2026, 08_50_41 AM (2).png": "clothing.jpg",
  "ChatGPT Image Aug 30, 2026, 08_50_43 AM (3).png": "business-printing.jpg",
  "ChatGPT Image Aug 30, 2026, 08_50_43 AM (4).png": "nfc-qr.jpg",
  "ChatGPT Image Aug 30, 2026, 08_50_44 AM (5).png": "bottles-tumblers.jpg",
  "ChatGPT Image Aug 30, 2026, 08_50_44 AM (6).png": "weddings.jpg",
  "ChatGPT Image Aug 30, 2026, 08_50_44 AM (7).png": "sports-clubs.jpg",
  "ChatGPT Image Aug 30, 2026, 08_50_44 AM (8).png": "uv-dtf.jpg",
};
let after = 0;
for (const [src, dst] of Object.entries(map)) {
  const buf = await sharp(src).resize({ width: 720, height: 720, fit: "cover" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  await sharp(buf).toFile(`public/categories/${dst}`);
  after += (await stat(`public/categories/${dst}`)).size;
  await rm(src, { force: true });
}
console.log(`Replaced 8 category images (${(after/1e6).toFixed(2)}MB total)`);
