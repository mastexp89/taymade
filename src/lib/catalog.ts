/**
 * Catalogue data layer.
 *
 * Today the storefront reads from the typed data below so pages are fully
 * working without a running database. The Prisma schema (prisma/schema.prisma)
 * mirrors these shapes, and prisma/seed.ts loads this same data into Postgres.
 * When the DB is connected, swap the query helpers at the bottom to hit Prisma
 * — pages and components call those helpers, so nothing else changes.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "colour"
  | "url"
  | "number"
  | "upload";

export type PersonalField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
  maxLength?: number;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  // Optional blank/plain photo used as the base for the live personalisation
  // preview (so the overlay text doesn't clash with an example name baked into
  // the main product photo). Falls back to `image` when not set.
  previewImage?: string;
  side: "personal" | "business";
  categories: string[];
  shortDesc: string;
  description?: string;
  leadTimeDays: number;
  badge?: string;
  bestSeller?: boolean;
  // Bundles: a fixed pack of items sold together, shown with a "what's included" list.
  bundle?: boolean;
  contents?: string[];
  fields: PersonalField[];
};

export type Category = {
  slug: string;
  name: string;
  image: string;
  accent: string;
};

// ---------- reusable personalisation field templates ----------
const f = {
  name: (label = "Name / text", placeholder = "e.g. Emily"): PersonalField => ({
    key: "name", label, type: "text", required: true, placeholder, maxLength: 24,
  }),
  font: (): PersonalField => ({
    key: "font", label: "Font", type: "select", options: ["Script", "Bold", "Classic", "Handwritten"],
  }),
  textColour: (): PersonalField => ({
    key: "textColour", label: "Text colour", type: "colour",
    options: ["#1E2A2E", "#FFFFFF", "#159AA0", "#F1502F", "#E6A32C", "#6D5BD0", "#54B15A"],
  }),
  productColour: (options: string[]): PersonalField => ({
    key: "productColour", label: "Product colour", type: "select", options,
  }),
  garmentColour: (options: string[]): PersonalField => ({
    key: "garmentColour", label: "Garment colour", type: "select", required: true, options,
  }),
  size: (): PersonalField => ({
    key: "size", label: "Size", type: "select", required: true,
    options: ["XS", "S", "M", "L", "XL", "XXL"],
  }),
  printText: (): PersonalField => ({
    key: "printText", label: "Text to print", type: "text", placeholder: "Your text (optional)", maxLength: 40,
  }),
  uploadArtwork: (label = "Upload artwork (optional)"): PersonalField => ({
    key: "artwork", label, type: "upload", help: "PNG, JPG, PDF or SVG. High-resolution or transparent PNG works best.",
  }),
  uploadLogo: (): PersonalField => ({
    key: "logo", label: "Upload your logo", type: "upload", required: true,
    help: "Transparent PNG or vector (SVG/PDF) gives the sharpest print.",
  }),
  company: (required = false): PersonalField => ({
    key: "company", label: "Company name", type: "text", required, placeholder: "e.g. Rachel's Plumbing Ltd",
  }),
  url: (key: string, label: string, placeholder: string): PersonalField => ({
    key, label, type: "url", required: true, placeholder,
  }),
  notes: (): PersonalField => ({
    key: "notes", label: "Special instructions", type: "textarea", placeholder: "Anything we should know?",
  }),
};

// ---------- products ----------
// The first six are flagged bestSeller and appear on the homepage in order.
export const products: Product[] = [
  {
    slug: "personalised-water-bottle", name: "Personalised Water Bottle",
    price: 19.99, rating: 5, reviews: 128, image: "/products/bottle-chloe.png",
    side: "personal", categories: ["personalised", "bottles-tumblers", "gifts"],
    shortDesc: "Insulated stainless-steel bottle with your name or message.",
    description:
      "A premium double-walled bottle that keeps drinks cold for 24 hours. UV-printed with your name, message or design — dishwasher-friendly and built to last.",
    leadTimeDays: 4, bestSeller: true,
    fields: [f.name("Name", "e.g. Chloe"), f.font(), f.textColour(), f.productColour(["White", "Black", "Pink", "Sage", "Navy"])],
  },
  {
    slug: "custom-t-shirt", name: "Custom T-Shirt",
    price: 16.99, rating: 5, reviews: 97, image: "/products/tshirt-dundee.png",
    side: "personal", categories: ["personalised", "clothing"],
    shortDesc: "Soft cotton tee pressed with your text or design.",
    description:
      "A comfortable ring-spun cotton T-shirt, pressed in-house with your text or uploaded design using durable DTF transfers. Machine washable.",
    leadTimeDays: 5, bestSeller: true,
    fields: [f.printText(), f.uploadArtwork(), f.garmentColour(["White", "Black", "Navy", "Grey", "Red"]), f.size()],
  },
  {
    slug: "google-review-nfc-plaque", name: "Google Review NFC Plaque",
    price: 24.99, rating: 5, reviews: 76, image: "/products/nfc-google-review.png",
    side: "business", categories: ["business", "nfc-qr"],
    shortDesc: "Tap-or-scan plaque that sends customers straight to your reviews.",
    description:
      "A premium acrylic plaque on an oak stand with a built-in NFC chip and printed QR code. Customers tap or scan to leave a Google review in seconds — a proven way to grow your rating.",
    leadTimeDays: 4, bestSeller: true,
    fields: [f.company(true), f.url("reviewUrl", "Google review link", "https://g.page/r/…"), f.notes()],
  },
  {
    slug: "custom-tumbler", name: "Custom Tumbler",
    price: 21.99, rating: 5, reviews: 64, image: "/products/tumbler-murray.png",
    side: "personal", categories: ["personalised", "bottles-tumblers", "gifts"],
    shortDesc: "Insulated travel tumbler engraved or printed with a name.",
    description:
      "A stainless-steel travel tumbler with a spill-resistant lid, personalised with a name, monogram or message. Keeps drinks hot or cold for hours.",
    leadTimeDays: 4, bestSeller: true,
    fields: [f.name("Name", "e.g. Murray"), f.font(), f.textColour(), f.productColour(["Sage", "Black", "White", "Navy", "Blush"])],
  },
  {
    slug: "personalised-hoodie", name: "Personalised Hoodie",
    price: 34.99, rating: 5, reviews: 58, image: "/products/hoodie-dundee.png",
    side: "personal", categories: ["personalised", "clothing"],
    shortDesc: "Cosy fleece hoodie with your name, text or design.",
    description:
      "A heavyweight brushed-fleece hoodie, pressed with your text or uploaded artwork. Warm, durable and made to order in Dundee.",
    leadTimeDays: 5, bestSeller: true,
    fields: [f.printText(), f.uploadArtwork(), f.garmentColour(["Grey", "Black", "Navy", "White"]), f.size()],
  },
  {
    slug: "nfc-menu-plaque", name: "NFC Menu Plaque",
    price: 24.99, rating: 5, reviews: 45, image: "/products/nfc-google-review.png",
    side: "business", categories: ["business", "nfc-qr"],
    shortDesc: "Tap-or-scan plaque linking guests to your digital menu.",
    description:
      "Let guests view your menu instantly. This acrylic plaque pairs an NFC chip with a printed QR code, both pointing at your menu — update the destination anytime.",
    leadTimeDays: 4, bestSeller: true,
    fields: [f.company(true), f.url("menuUrl", "Menu link", "https://…"), f.notes()],
  },
  {
    slug: "personalised-mug", name: "Personalised Mug",
    price: 9.99, rating: 5, reviews: 71, image: "/products/mug-you-got-this.png",
    side: "personal", categories: ["personalised", "gifts"],
    shortDesc: "Ceramic mug printed with your message or photo.",
    description:
      "A classic ceramic mug printed with your name, message or photo. Dishwasher and microwave safe — a perfect little gift.",
    leadTimeDays: 3,
    fields: [f.name("Message line 1", "e.g. You Got This"), { key: "line2", label: "Message line 2 (optional)", type: "text", maxLength: 24 }, f.font(), f.textColour()],
  },
  {
    slug: "custom-phone-case", name: "Custom Phone Case",
    price: 14.99, rating: 5, reviews: 61, image: "/illustrations/phone-case.svg",
    side: "personal", categories: ["personalised", "gifts"],
    shortDesc: "Personalised phone case with your photo, name or design.",
    description:
      "A durable, slim-fit phone case printed edge to edge with your photo, name or design. Protects your phone and shows off your style.",
    leadTimeDays: 4,
    fields: [
      { key: "model", label: "Phone model", type: "select", required: true, options: ["iPhone 15", "iPhone 14", "iPhone 13", "Samsung S24", "Samsung S23", "Other — we'll confirm"] },
      f.name("Name / text (optional)", "e.g. Emily"),
      f.uploadArtwork("Upload a photo or design (optional)"),
    ],
  },
  {
    slug: "custom-pen", name: "Custom Printed Pen",
    price: 3.99, rating: 5, reviews: 40, image: "/illustrations/biz-promo.svg",
    side: "personal", categories: ["personalised", "business", "gifts"],
    shortDesc: "Printed pen with your name, logo or message.",
    description:
      "Smooth-writing pens printed with your name, message or company logo — lovely as a gift or a promotional giveaway. Great value in bulk.",
    leadTimeDays: 5,
    fields: [
      f.name("Text to print", "e.g. Rachel's Plumbing Ltd"),
      f.uploadArtwork("Upload a logo (optional)"),
      f.productColour(["White", "Black", "Navy", "Teal", "Red"]),
    ],
  },
  {
    slug: "custom-golf-balls", name: "Custom Golf Balls",
    price: 9.99, rating: 5, reviews: 22, image: "/illustrations/golf-ball.svg",
    side: "personal", categories: ["personalised", "sports-clubs", "gifts"],
    shortDesc: "Golf balls printed with initials, name or a logo.",
    description:
      "Never lose track of your ball again. Printed with your initials, name or club/company logo — a brilliant gift for the golfer who has everything.",
    leadTimeDays: 6,
    fields: [
      f.name("Initials or name", "e.g. JS"),
      f.uploadArtwork("Upload a logo (optional)"),
    ],
  },
  {
    slug: "wedding-heart-sign", name: "Wedding Heart Sign",
    price: 18.99, rating: 5, reviews: 39, image: "/products/wedding-heart-anderson.png",
    side: "personal", categories: ["personalised", "weddings", "gifts"],
    shortDesc: "Hanging wooden heart with names and date.",
    description:
      "A rustic wooden heart with ribbon hanger, printed with the couple's names and wedding date. A keepsake for the big day.",
    leadTimeDays: 5,
    fields: [f.name("Names", "e.g. Mr & Mrs Anderson"), { key: "date", label: "Date", type: "text", placeholder: "e.g. 12.08.2024", maxLength: 20 }, f.font()],
  },
  {
    slug: "acrylic-family-sign", name: "Acrylic Family Sign",
    price: 22.99, rating: 5, reviews: 33, image: "/products/acrylic-mcleans.png",
    side: "personal", categories: ["personalised", "gifts", "weddings"],
    shortDesc: "Freestanding acrylic sign with your family name.",
    description:
      "A clear acrylic block sign, engraved-look printed with your family name and established year. Beautiful on a mantel or shelf.",
    leadTimeDays: 5,
    fields: [f.name("Family name", "e.g. The McLeans"), { key: "estYear", label: "Established year", type: "text", placeholder: "e.g. 2024", maxLength: 12 }, f.font()],
  },
  {
    slug: "football-shirt", name: "Custom Football Shirt",
    price: 27.99, rating: 5, reviews: 28, image: "/products/football-dundee-united.png",
    side: "personal", categories: ["personalised", "sports-clubs", "clothing"],
    shortDesc: "Team shirt with club name, name and number.",
    description:
      "A breathable performance shirt printed with your club name, plus an optional name and squad number on the back. Great for teams, five-a-sides and supporters.",
    leadTimeDays: 6,
    fields: [f.name("Club name", "e.g. Dundee United FC"), { key: "backName", label: "Name on back (optional)", type: "text", maxLength: 14 }, { key: "number", label: "Squad number (optional)", type: "number" }, f.size()],
  },
  {
    slug: "business-logo-t-shirt", name: "Business Logo T-Shirt",
    price: 17.99, rating: 5, reviews: 52, image: "/products/tshirt-your-logo.png",
    side: "business", categories: ["business", "clothing"],
    shortDesc: "Workwear tee pressed with your company logo.",
    description:
      "Kit out your team. Upload your logo and we'll press it onto quality cotton tees — ideal for staff uniforms, events and trade. Bulk discounts available on request.",
    leadTimeDays: 6,
    fields: [f.uploadLogo(), f.company(false), f.garmentColour(["Black", "White", "Navy", "Grey"]), f.size()],
  },

  // ----- expanded personalised range -----
  {
    slug: "custom-keyring", name: "Custom Keyring",
    price: 5.99, rating: 5, reviews: 47, image: "/illustrations/keyring.svg",
    side: "personal", categories: ["personalised", "gifts"],
    shortDesc: "Wooden or acrylic keyring with a name, date or logo.",
    description: "A hard-wearing keyring printed with a name, date, message or logo — a lovely little gift or handy for teams and staff.",
    leadTimeDays: 3,
    fields: [f.name("Name / text", "e.g. Dad"), f.font(), f.uploadArtwork("Upload a logo (optional)")],
  },
  {
    slug: "personalised-coasters", name: "Personalised Coasters (Set of 4)",
    price: 12.99, rating: 5, reviews: 34, image: "/illustrations/coasters.svg",
    side: "personal", categories: ["personalised", "gifts"],
    shortDesc: "Set of four coasters with your names, photos or design.",
    description: "A set of four durable coasters printed with names, photos or a design of your choice. A perfect housewarming or wedding gift.",
    leadTimeDays: 4,
    fields: [f.name("Name / text", "e.g. The Andersons"), f.font(), f.uploadArtwork("Upload a photo or design (optional)")],
  },
  {
    slug: "kids-personalised-t-shirt", name: "Kids Personalised T-Shirt",
    price: 12.99, rating: 5, reviews: 55, image: "/illustrations/kids-tshirt.svg",
    side: "personal", categories: ["personalised", "clothing"],
    shortDesc: "Soft kids' tee with their name, age or design.",
    description: "A comfy cotton kids' T-shirt pressed with a name, age, birthday number or design. Machine washable and made to order.",
    leadTimeDays: 5,
    fields: [f.printText(), f.uploadArtwork(), f.garmentColour(["White", "Pink", "Blue", "Grey", "Black"]),
      { key: "size", label: "Age", type: "select", required: true, options: ["3-4y", "5-6y", "7-8y", "9-10y", "11-12y"] }],
  },
  {
    slug: "personalised-baby-grow", name: "Personalised Baby Grow",
    price: 13.99, rating: 5, reviews: 38, image: "/illustrations/baby-grow.svg",
    side: "personal", categories: ["personalised", "clothing", "gifts"],
    shortDesc: "Baby grow with name, arrival details or a cute design.",
    description: "A soft cotton baby grow printed with a name, arrival date or design — a treasured new-baby gift.",
    leadTimeDays: 5,
    fields: [f.name("Name / text", "e.g. Baby Grace"), f.uploadArtwork("Upload a design (optional)"), f.garmentColour(["White", "Pink", "Blue", "Grey", "Sage"]),
      { key: "size", label: "Size", type: "select", required: true, options: ["0-3m", "3-6m", "6-12m", "12-18m", "18-24m"] }],
  },
  {
    slug: "personalised-tote-bag", name: "Personalised Tote Bag",
    price: 9.99, rating: 5, reviews: 41, image: "/illustrations/tote-bag.svg",
    side: "personal", categories: ["personalised", "gifts", "clothing"],
    shortDesc: "Cotton tote printed with your name, design or logo.",
    description: "A sturdy cotton tote bag printed with a name, design or logo — great as a gift, wedding favour or branded giveaway.",
    leadTimeDays: 4,
    fields: [f.printText(), f.uploadArtwork(), f.productColour(["Natural", "Black"])],
  },

  // ----- more business -----
  {
    slug: "printed-workwear", name: "Printed Workwear",
    price: 16.99, rating: 5, reviews: 63, image: "/illustrations/workwear.svg",
    side: "business", categories: ["business", "clothing"],
    shortDesc: "Branded T-shirts, polos, hoodies and hi-vis for your team.",
    description: "Kit out your team with durable printed workwear. Choose the garment, upload your logo and we'll press it in-house. Bulk pricing on request.",
    leadTimeDays: 6,
    fields: [f.uploadLogo(), f.company(false),
      { key: "garmentType", label: "Garment", type: "select", required: true, options: ["T-Shirt", "Polo Shirt", "Hoodie", "Hi-Vis Vest", "Sweatshirt"] },
      f.garmentColour(["Black", "Navy", "Grey", "White", "Hi-Vis Yellow"]), f.size()],
  },
  {
    slug: "business-branded-bottle", name: "Business Branded Bottle",
    price: 14.99, rating: 5, reviews: 29, image: "/illustrations/business-bottle.svg",
    side: "business", categories: ["business", "bottles-tumblers"],
    shortDesc: "Insulated bottle printed with your company logo.",
    description: "A premium insulated bottle printed with your logo — ideal for staff, events and client gifts. Discounts on larger quantities.",
    leadTimeDays: 5,
    fields: [f.uploadLogo(), f.company(false), f.productColour(["Black", "White", "Navy", "Silver"])],
  },

  // ----- UV-DTF transfers -----
  {
    slug: "uv-dtf-custom-transfer", name: "UV-DTF Custom Transfer",
    price: 4.99, rating: 5, reviews: 36, image: "/illustrations/uv-transfer.svg",
    side: "personal", categories: ["uv-dtf", "business"],
    shortDesc: "Your artwork printed on UV-DTF film — you apply it yourself.",
    description: "We print your logo or artwork onto UV-DTF film and send it to you to apply to any smooth, hard surface. No machinery needed at your end.",
    leadTimeDays: 4,
    fields: [{ key: "artwork", label: "Upload your artwork", type: "upload", required: true, help: "High-resolution PNG (transparent) or vector (SVG/PDF) works best." },
      { key: "size", label: "Approx. size", type: "text", placeholder: "e.g. 8cm wide" }, f.notes()],
  },
  {
    slug: "uv-dtf-a4-gang-sheet", name: "UV-DTF A4 Gang Sheet",
    price: 12.99, rating: 5, reviews: 24, image: "/illustrations/gang-sheet-a4.svg",
    side: "personal", categories: ["uv-dtf", "business"],
    shortDesc: "Fill an A4 sheet with your designs — maximum value.",
    description: "Send us your designs and we'll gang them onto a full A4 UV-DTF sheet — the most cost-effective way to order multiple transfers.",
    leadTimeDays: 5,
    fields: [{ key: "artwork", label: "Upload your artwork / gang sheet", type: "upload", required: true, help: "Send a ready A4 layout, or your logos and we'll arrange them." }, f.notes()],
  },
  {
    slug: "uv-dtf-a3-gang-sheet", name: "UV-DTF A3 Gang Sheet",
    price: 19.99, rating: 5, reviews: 19, image: "/illustrations/gang-sheet-a3.svg",
    side: "personal", categories: ["uv-dtf", "business"],
    shortDesc: "A larger A3 sheet — even more designs per order.",
    description: "A full A3 UV-DTF sheet packed with your designs. Ideal for businesses and makers ordering transfers in volume.",
    leadTimeDays: 5,
    fields: [{ key: "artwork", label: "Upload your artwork / gang sheet", type: "upload", required: true, help: "Send a ready A3 layout, or your logos and we'll arrange them." }, f.notes()],
  },

  // ----- bundles -----
  {
    slug: "business-starter-pack", name: "Business Starter Pack",
    price: 149, rating: 5, reviews: 12, image: "/illustrations/bundle-business.svg",
    side: "business", categories: ["business", "bundles"], bundle: true,
    contents: ["10 × NFC / QR table plaques", "1 × Google Review NFC plaque", "1 × Wi-Fi plaque", "2 × Reserved signs", "1 × Opening-hours plaque"],
    shortDesc: "Everything a new venue needs to get set up — one simple pack.",
    description: "A complete starter kit for hospitality and retail: table plaques, a Google review plaque, Wi-Fi and reserved signs and an opening-hours plaque — all branded to you. Price is a guide; tell us your needs and we'll confirm.",
    leadTimeDays: 7,
    fields: [f.company(true), f.uploadLogo(), { key: "link", label: "Website / review / menu link", type: "text", placeholder: "https://…" }, f.notes()],
  },
  {
    slug: "restaurant-nfc-pack", name: "Restaurant NFC Pack",
    price: 129, rating: 5, reviews: 9, image: "/illustrations/bundle-restaurant.svg",
    side: "business", categories: ["business", "bundles", "nfc-qr"], bundle: true,
    contents: ["NFC menu plaques", "Table numbers", "Google review plaque", "Wi-Fi plaque", "Reserved signs"],
    shortDesc: "Menus, reviews, Wi-Fi and table signage for your restaurant.",
    description: "Get your restaurant fully tapped-in: NFC menu plaques, table numbers, a Google review plaque, a Wi-Fi plaque and reserved signs. Price is a guide; we'll tailor it to your venue.",
    leadTimeDays: 7,
    fields: [f.company(true), f.uploadLogo(), { key: "link", label: "Menu / review link", type: "text", placeholder: "https://…" }, f.notes()],
  },
  {
    slug: "staff-pack", name: "Staff Pack",
    price: 89, rating: 5, reviews: 15, image: "/illustrations/bundle-staff.svg",
    side: "business", categories: ["business", "bundles", "clothing"], bundle: true,
    contents: ["1 × Branded T-shirt", "1 × Branded hoodie", "1 × Branded bottle", "1 × Name badge"],
    shortDesc: "Kit out a team member — clothing, bottle and badge.",
    description: "Everything one staff member needs: a branded T-shirt, hoodie, bottle and name badge. Order one per team member — bulk discounts apply.",
    leadTimeDays: 7,
    fields: [f.company(true), f.uploadLogo(), { key: "name", label: "Staff name (for badge)", type: "text", placeholder: "e.g. Rachel" }, f.size(), f.notes()],
  },
  {
    slug: "startup-brand-pack", name: "Startup Brand Pack",
    price: 119, rating: 5, reviews: 8, image: "/illustrations/bundle-startup.svg",
    side: "business", categories: ["business", "bundles"], bundle: true,
    contents: ["Branded clothing item", "NFC business card", "Google review plaque", "Branded bottle", "Desk sign"],
    shortDesc: "Launch your brand with the essentials in one pack.",
    description: "A brand-in-a-box for new businesses: a branded clothing item, an NFC business card, a Google review plaque, a branded bottle and a desk sign. Price is a guide; we'll confirm to suit you.",
    leadTimeDays: 7,
    fields: [f.company(true), f.uploadLogo(), { key: "link", label: "Website / review link", type: "text", placeholder: "https://…" }, f.notes()],
  },
];

// Real product photos + blank preview bases (Dylan-supplied), applied as
// overrides so the product definitions above stay tidy.
const REAL_PHOTOS: Record<string, string> = {
  "custom-phone-case": "/products/custom-phone-case.jpg",
  "custom-pen": "/products/custom-pen.jpg",
  "custom-golf-balls": "/products/custom-golf-balls.jpg",
  "custom-keyring": "/products/custom-keyring.jpg",
  "personalised-coasters": "/products/personalised-coasters.jpg",
  "kids-personalised-t-shirt": "/products/kids-personalised-t-shirt.jpg",
  "personalised-baby-grow": "/products/personalised-baby-grow.jpg",
  "personalised-tote-bag": "/products/personalised-tote-bag.jpg",
  "printed-workwear": "/products/printed-workwear.jpg",
  "business-branded-bottle": "/products/business-branded-bottle.jpg",
  "business-starter-pack": "/products/business-starter-pack.jpg",
  "restaurant-nfc-pack": "/products/restaurant-nfc-pack.jpg",
  "staff-pack": "/products/staff-pack.jpg",
  "startup-brand-pack": "/products/startup-brand-pack.jpg",
};
const PREVIEW_BLANKS: Record<string, string> = {
  "personalised-water-bottle": "/products/blanks/personalised-water-bottle.jpg",
  "custom-tumbler": "/products/blanks/custom-tumbler.jpg",
  "personalised-mug": "/products/blanks/personalised-mug.jpg",
  "custom-t-shirt": "/products/blanks/custom-t-shirt.jpg",
  "personalised-hoodie": "/products/blanks/personalised-hoodie.jpg",
  "acrylic-family-sign": "/products/blanks/acrylic-family-sign.jpg",
  "wedding-heart-sign": "/products/blanks/wedding-heart-sign.jpg",
  "custom-phone-case": "/products/blanks/custom-phone-case.jpg",
  "custom-pen": "/products/blanks/custom-pen.jpg",
  "custom-golf-balls": "/products/blanks/custom-golf-balls.jpg",
  "custom-keyring": "/products/blanks/custom-keyring.jpg",
  "personalised-coasters": "/products/blanks/personalised-coasters.jpg",
  "kids-personalised-t-shirt": "/products/blanks/kids-personalised-t-shirt.jpg",
  "personalised-baby-grow": "/products/blanks/personalised-baby-grow.jpg",
  "personalised-tote-bag": "/products/blanks/personalised-tote-bag.jpg",
  "football-shirt": "/products/blanks/football-shirt.jpg",
};
for (const p of products) {
  if (REAL_PHOTOS[p.slug]) p.image = REAL_PHOTOS[p.slug];
  if (PREVIEW_BLANKS[p.slug]) p.previewImage = PREVIEW_BLANKS[p.slug];
}

// ---------- homepage grid (kept for the existing home components) ----------
export const categories: Category[] = [
  { slug: "personalised", name: "Personalised Gifts", image: "/categories/personalised-gifts.jpg", accent: "var(--c-teal)" },
  { slug: "personalised/clothing", name: "Clothing", image: "/categories/clothing.jpg", accent: "var(--c-coral)" },
  { slug: "business", name: "Business Printing", image: "/categories/business-printing.jpg", accent: "var(--c-blue)" },
  { slug: "nfc-qr", name: "NFC & QR", image: "/categories/nfc-qr.jpg", accent: "var(--c-green)" },
  { slug: "personalised/bottles-tumblers", name: "Bottles & Tumblers", image: "/categories/bottles-tumblers.jpg", accent: "var(--c-teal)" },
  { slug: "personalised/weddings", name: "Weddings", image: "/categories/weddings.jpg", accent: "var(--c-purple)" },
  { slug: "personalised/sports-clubs", name: "Sports & Clubs", image: "/categories/sports-clubs.jpg", accent: "var(--c-amber)" },
];

export const businessItems = [
  { label: "Branded Clothing", image: "/products/tshirt-your-logo.png" },
  { label: "NFC Products", image: "/illustrations/biz-nfc.svg" },
  { label: "QR Signs", image: "/illustrations/biz-qr.svg" },
  { label: "Review Plaques", image: "/products/nfc-google-review.png" },
  { label: "Promotional Products", image: "/illustrations/biz-promo.svg" },
];

export const reviews = [
  { stars: 5, body: "Amazing quality and so fast! The water bottle looks even better in person. Will definitely order again.", name: "Laura, Dundee", tint: "#E4CBB2", tint2: "#C89B72" },
  { stars: 5, body: "The NFC plaques have transformed our business. So easy to use and our reviews have gone up!", name: "Ross, Business Owner", tint: "#B8C6CE", tint2: "#7E93A0" },
  { stars: 5, body: "Our wedding sign was perfect and everyone loved it. Such a personal touch to our big day.", name: "Chloe & Jamie", tint: "#D8C3D0", tint2: "#A886A0" },
];

// ---------- category metadata for listing pages ----------
export type CategoryMeta = {
  token: string;
  title: string;
  subtitle: string;
  side: "personal" | "business";
};

export const categoryMeta: Record<string, CategoryMeta> = {
  personalised: { token: "personalised", title: "Personalised Gifts", subtitle: "Thoughtful gifts made just for them — add a name, message or photo.", side: "personal" },
  clothing: { token: "clothing", title: "Personalised Clothing", subtitle: "Custom tees, hoodies and more, pressed to order in Dundee.", side: "personal" },
  "bottles-tumblers": { token: "bottles-tumblers", title: "Bottles & Tumblers", subtitle: "Insulated bottles and tumblers with your name or design.", side: "personal" },
  weddings: { token: "weddings", title: "Weddings", subtitle: "Signs, favours and keepsakes for the big day.", side: "personal" },
  "sports-clubs": { token: "sports-clubs", title: "Sports & Clubs", subtitle: "Kit, bottles and merch for teams and supporters.", side: "personal" },
  gifts: { token: "gifts", title: "Gifts", subtitle: "Personalised gifts for every occasion.", side: "personal" },
  business: { token: "business", title: "Business Printing", subtitle: "Branded clothing, NFC & QR products, signage and promotional items.", side: "business" },
  "nfc-qr": { token: "nfc-qr", title: "NFC & QR", subtitle: "Smart tap-or-scan products — reviews, menus, Wi-Fi and more.", side: "business" },
  "uv-dtf": { token: "uv-dtf", title: "UV-DTF Transfers", subtitle: "Your artwork printed on UV-DTF film — apply it yourself to hard surfaces.", side: "personal" },
  bundles: { token: "bundles", title: "Bundles & Packs", subtitle: "Ready-made packs that bundle our most-wanted products — great value for business.", side: "business" },
};

// ---------- query helpers (swap these for Prisma later) ----------
export const bestSellers: Product[] = products.filter((p) => p.bestSeller);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(token: string): Product[] {
  return products.filter((p) => p.categories.includes(token));
}

export function allProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

export const priceGBP = (n: number) => `£${n.toFixed(2)}`;
