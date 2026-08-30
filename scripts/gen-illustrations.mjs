// Generates placeholder product illustrations as standalone SVG files.
// These are STAND-INS. To use a real photo, drop a file at the same path
// (e.g. public/illustrations/bottle-emma.jpg) and update the `image` path
// in src/lib/catalog.ts — the components will render it automatically.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "illustrations");
mkdirSync(OUT, { recursive: true });

// reusable fake-QR block
const qr = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})"><rect width="60" height="60" rx="4" fill="#fff"/><g fill="#1E2A2E"><rect x="6" y="6" width="16" height="16" rx="2"/><rect x="10" y="10" width="8" height="8" fill="#fff"/><rect x="38" y="6" width="16" height="16" rx="2"/><rect x="42" y="10" width="8" height="8" fill="#fff"/><rect x="6" y="38" width="16" height="16" rx="2"/><rect x="10" y="42" width="8" height="8" fill="#fff"/><rect x="28" y="8" width="4" height="4"/><rect x="28" y="16" width="4" height="4"/><rect x="28" y="28" width="4" height="4"/><rect x="36" y="28" width="4" height="4"/><rect x="44" y="28" width="4" height="4"/><rect x="52" y="28" width="4" height="4"/><rect x="28" y="36" width="4" height="4"/><rect x="28" y="44" width="4" height="4"/><rect x="28" y="52" width="4" height="4"/><rect x="36" y="44" width="4" height="4"/><rect x="44" y="52" width="4" height="4"/><rect x="52" y="44" width="4" height="4"/><rect x="44" y="36" width="4" height="4"/><rect x="52" y="36" width="4" height="4"/><rect x="36" y="52" width="4" height="4"/><rect x="16" y="28" width="4" height="4"/><rect x="8" y="28" width="4" height="4"/></g></g>`;
const svg = (vb, inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${inner}</svg>`;

const files = {
  // ---------- CATEGORY TILES (viewBox 0 0 120 120) ----------
  "cat-gifts": svg("0 0 120 120", `<rect x="24" y="46" width="72" height="56" rx="5" fill="#C9A87C"/><rect x="24" y="46" width="72" height="16" fill="#B8946A"/><rect x="54" y="46" width="12" height="56" fill="#8C6B45"/><path d="M60 46C48 26 30 36 42 46M60 46C72 26 90 36 78 46" fill="#D8BE96"/>`),
  "cat-clothing": svg("0 0 120 120", `<path d="M30 34l18-12c4 8 20 8 24 0l18 12 12 20-16 12-6-6v50c0 3-2 5-5 5H45c-3 0-5-2-5-5V60l-6 6-16-12z" fill="#2E5AA8"/>`),
  "cat-business": svg("0 0 120 120", `<path d="M32 30l16-9c4 6 20 6 24 0l16 9 9 16-14 9-4-4v46c0 3-2 4-4 4H47c-3 0-5-2-5-4V51l-4 4-14-9z" fill="#20292C"/><rect x="46" y="52" width="28" height="18" rx="2" fill="#F0603E"/><text x="60" y="64" font-family="Poppins,Arial" font-weight="700" font-size="7" fill="#fff" text-anchor="middle">YOUR LOGO</text>`),
  "cat-nfc": svg("0 0 120 120", `<rect x="36" y="14" width="48" height="72" rx="6" fill="#20292C"/><circle cx="60" cy="30" r="9" fill="#fff"/><text x="60" y="35" font-family="Poppins,Arial" font-weight="700" font-size="11" fill="#4285F4" text-anchor="middle">G</text>${qr(42, 44, 0.5)}<rect x="40" y="86" width="40" height="10" rx="3" fill="#7A5230"/><rect x="32" y="96" width="56" height="8" rx="3" fill="#5F4025"/>`),
  "cat-bottles": svg("0 0 120 120", `<path d="M46 30h28l-4 62c0 4-3 6-6 6h-8c-3 0-6-2-6-6z" fill="#9DBFB8"/><rect x="48" y="18" width="24" height="12" rx="3" fill="#7FA69E"/><text x="60" y="70" font-family="Poppins,Arial" font-weight="700" font-size="18" fill="#fff" text-anchor="middle">M</text>`),
  "cat-weddings": svg("0 0 120 120", `<path d="M60 96C34 76 24 62 24 46c0-12 9-19 18-19 7 0 13 4 18 11 5-7 11-11 18-11 9 0 18 7 18 19 0 16-10 30-36 50z" fill="#E7D6BE" stroke="#C9B592" stroke-width="2"/><text x="60" y="52" font-family="Dancing Script,cursive" font-weight="700" font-size="13" fill="#7A5230" text-anchor="middle">Mr &amp; Mrs</text><text x="60" y="68" font-family="Dancing Script,cursive" font-weight="700" font-size="11" fill="#7A5230" text-anchor="middle">Anderson</text>`),
  "cat-sports": svg("0 0 120 120", `<path d="M30 34l18-12c4 8 20 8 24 0l18 12 12 20-16 12-6-6v50c0 3-2 5-5 5H45c-3 0-5-2-5-5V60l-6 6-16-12z" fill="#2E5AA8"/><text x="60" y="80" font-family="Poppins,Arial" font-weight="800" font-size="11" fill="#fff" text-anchor="middle">DUNDEE</text>`),

  // ---------- BEST SELLERS ----------
  "bottle-emma": svg("0 0 120 150", `<rect x="52" y="6" width="16" height="12" rx="3" fill="#B9C0C2"/><path d="M44 26c0-6 5-9 16-9s16 3 16 9v104c0 7-5 11-16 11s-16-4-16-11z" fill="#fff" stroke="#E0E1DB" stroke-width="1.5"/><text x="60" y="92" font-family="Dancing Script,cursive" font-size="20" fill="#159AA0" text-anchor="middle">Emma</text>`),
  "tshirt": svg("0 0 120 120", `<path d="M32 30l14-9c4 6 24 6 28 0l14 9 10 15-13 9-5-5v46c0 2-2 4-4 4H44c-2 0-4-2-4-4V49l-5 5-13-9z" fill="#243A54"/><path d="M50 44h20l-2 8h-16z" fill="#fff"/><path d="M46 40l14-6 14 6" fill="none" stroke="#fff" stroke-width="1.5"/>`),
  "review-plaque": svg("0 0 120 150", `<rect x="34" y="10" width="52" height="100" rx="6" fill="#20292C"/><circle cx="60" cy="28" r="10" fill="#fff"/><text x="60" y="33" font-family="Poppins,Arial" font-weight="700" font-size="11" fill="#4285F4" text-anchor="middle">G</text>${qr(41, 42, 0.6)}<rect x="38" y="112" width="44" height="10" rx="3" fill="#7A5230"/><rect x="30" y="122" width="60" height="8" rx="3" fill="#5F4025"/>`),
  "tumbler-a": svg("0 0 120 150", `<path d="M40 22h40l-5 118c0 4-3 7-7 7H52c-4 0-7-3-7-7z" fill="#20292C"/><rect x="38" y="14" width="44" height="9" rx="3" fill="#3a4548"/><text x="60" y="82" font-family="Poppins,Arial" font-weight="700" font-size="22" fill="#fff" text-anchor="middle">A</text><path d="M46 94h28" stroke="#fff" stroke-width="1" opacity="0.6"/><text x="60" y="108" font-family="Poppins,Arial" font-size="7" fill="#fff" text-anchor="middle" letter-spacing="1">ANDERSON</text>`),
  "hoodie-dundee": svg("0 0 120 120", `<path d="M34 34l12-8c2 8 22 8 24 0l12 8 10 14-12 9-4-4v42c0 2-2 4-4 4H44c-2 0-4-2-4-4V53l-4 4-12-9z" fill="#B7BDBB"/><path d="M46 26c2 10 22 10 24 0l-4 14c-2 6-14 6-16 0z" fill="#9aa2a0"/><text x="58" y="70" font-family="Poppins,Arial" font-weight="800" font-size="11" fill="#4a5350" text-anchor="middle">DUNDEE</text>`),
  "nfc-menu": svg("0 0 120 150", `<rect x="34" y="10" width="52" height="100" rx="6" fill="#20292C"/><circle cx="60" cy="28" r="10" fill="none" stroke="#3BB8AF" stroke-width="2"/><text x="60" y="32" font-family="Figtree,Arial" font-size="9" fill="#fff" text-anchor="middle">MENU</text>${qr(41, 42, 0.6)}<rect x="38" y="112" width="44" height="10" rx="3" fill="#7A5230"/><rect x="30" y="122" width="60" height="8" rx="3" fill="#5F4025"/>`),

  // ---------- BUSINESS BAND ----------
  "biz-clothing": svg("0 0 120 120", `<path d="M34 30l16-9c4 6 20 6 24 0l16 9 9 16-14 9-4-4v46c0 3-2 4-4 4H47c-3 0-5-2-5-4V51l-4 4-14-9z" fill="#20292C"/><rect x="46" y="46" width="28" height="20" rx="2" fill="#fff"/><text x="60" y="59" font-family="Poppins,Arial" font-weight="700" font-size="7" fill="#20292C" text-anchor="middle">YOUR LOGO</text>`),
  "biz-nfc": svg("0 0 120 120", `<rect x="40" y="24" width="40" height="64" rx="5" fill="#20292C"/><circle cx="60" cy="44" r="10" fill="none" stroke="#3BB8AF" stroke-width="2"/><path d="M54 44h12M60 38v12" stroke="#3BB8AF" stroke-width="2"/><text x="60" y="72" font-family="Figtree,Arial" font-size="8" fill="#fff" text-anchor="middle">TAP</text>`),
  "biz-qr": svg("0 0 120 120", `<rect x="32" y="22" width="56" height="72" rx="5" fill="#20292C"/>${qr(42, 32, 0.6)}<text x="60" y="88" font-family="Figtree,Arial" font-size="9" fill="#fff" text-anchor="middle">SCAN ME</text>`),
  "biz-review": svg("0 0 120 120", `<rect x="40" y="16" width="40" height="72" rx="5" fill="#20292C"/><circle cx="60" cy="34" r="9" fill="#fff"/><text x="60" y="38" font-family="Poppins,Arial" font-weight="700" font-size="9" fill="#4285F4" text-anchor="middle">G</text>${qr(44, 46, 0.5)}`),
  "biz-promo": svg("0 0 120 120", `<g transform="rotate(-18 60 60)"><rect x="20" y="54" width="78" height="12" rx="6" fill="#fff" stroke="#E0E1DB" stroke-width="1"/><path d="M98 48l10-6-2 12z" fill="#159AA0"/><rect x="28" y="55" width="26" height="10" rx="5" fill="#159AA0"/><text x="41" y="63" font-family="Poppins,Arial" font-weight="700" font-size="5" fill="#fff" text-anchor="middle">YOUR LOGO</text></g>`),

  // ---------- HERO CLUSTER ----------
  "hero-cluster": svg("0 0 620 300", `
    <!-- bottle -->
    <g transform="translate(6,54)"><rect x="28" y="6" width="14" height="12" rx="3" fill="#B9C0C2"/><rect x="24" y="16" width="22" height="10" rx="3" fill="#9AA3A5"/><path d="M22 34c0-6 4-8 13-8s13 2 13 8v196c0 8-4 12-13 12s-13-4-13-12z" fill="#fff" stroke="#DBDCD6" stroke-width="1.5"/><text x="35" y="150" font-family="Dancing Script,cursive" font-size="22" fill="#159AA0" text-anchor="middle">Chloe</text><path d="M31 168c2 3 6 3 8 0" stroke="#159AA0" stroke-width="1.6" fill="none"/></g>
    <!-- sweatshirt -->
    <g transform="translate(78,70)"><path d="M40 40l30-16c6 8 24 8 30 0l30 16 16 26-22 16-8-8v96c0 4-3 6-6 6H60c-3 0-6-2-6-6V74l-8 8-22-16z" fill="#213A5C"/><text x="85" y="96" font-family="Poppins,Arial" font-weight="800" font-size="20" fill="#fff" text-anchor="middle" letter-spacing="1">DUNDEE</text><rect x="60" y="104" width="50" height="14" rx="2" fill="#fff"/><text x="85" y="115" font-family="Poppins,Arial" font-weight="700" font-size="10" fill="#213A5C" text-anchor="middle" letter-spacing="1">EST. 1487</text><text x="85" y="140" font-family="Poppins,Arial" font-weight="700" font-size="15" fill="#fff" text-anchor="middle" letter-spacing="1">SCOTLAND</text></g>
    <!-- nfc plaque -->
    <g transform="translate(300,74)"><rect x="18" y="10" width="84" height="150" rx="8" fill="#20292C"/><g transform="translate(34,26)"><circle cx="26" cy="12" r="11" fill="none" stroke="#3BB8AF" stroke-width="2"/><path d="M20 12h6M26 6v6" stroke="#3BB8AF" stroke-width="2"/><text x="26" y="42" font-family="Figtree,Arial" font-size="7.5" fill="#fff" text-anchor="middle">Tap or Scan to</text><text x="26" y="52" font-family="Figtree,Arial" font-size="7.5" fill="#fff" text-anchor="middle">leave a Review</text>${qr(6, 60, 0.6)}<circle cx="26" cy="112" r="10" fill="#fff"/><text x="26" y="116" font-family="Poppins,Arial" font-weight="700" font-size="12" fill="#4285F4" text-anchor="middle">G</text></g><rect x="30" y="160" width="60" height="14" rx="3" fill="#7A5230"/><rect x="24" y="172" width="72" height="10" rx="3" fill="#5F4025"/></g>
    <!-- acrylic -->
    <g transform="translate(420,84)"><rect x="14" y="20" width="92" height="130" rx="6" fill="#D8E6E4" opacity="0.7"/><rect x="14" y="20" width="92" height="130" rx="6" fill="none" stroke="#B9CFCC" stroke-width="1.5"/><text x="60" y="66" font-family="Dancing Script,cursive" font-weight="700" font-size="16" fill="#2E4A48" text-anchor="middle">The</text><text x="60" y="92" font-family="Dancing Script,cursive" font-weight="700" font-size="24" fill="#2E4A48" text-anchor="middle">McLeans</text><text x="60" y="116" font-family="Poppins,Arial" font-size="10" fill="#2E4A48" text-anchor="middle" letter-spacing="1">EST. 2024</text><rect x="34" y="150" width="52" height="10" rx="3" fill="#C7D6D3"/></g>
    <!-- mug -->
    <g transform="translate(500,178)"><rect x="16" y="24" width="78" height="76" rx="12" fill="#fff" stroke="#E0E1DB" stroke-width="1.5"/><path d="M94 42c18 0 18 34 0 34" fill="none" stroke="#CFD0CA" stroke-width="7"/><text x="55" y="58" font-family="Dancing Script,cursive" font-weight="700" font-size="16" fill="#1E2A2E" text-anchor="middle">You Got</text><text x="55" y="80" font-family="Dancing Script,cursive" font-weight="700" font-size="16" fill="#1E2A2E" text-anchor="middle">This</text></g>
  `),
};

let n = 0;
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT, `${name}.svg`), content.trim());
  n++;
}
console.log(`Wrote ${n} illustration files to public/illustrations`);
