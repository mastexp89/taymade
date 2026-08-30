// Pure data (no imports) so both the app and prisma/seed.ts (run via tsx) can use it.

const D = "Drinkware";
const S = "Signage · NFC & QR";
const G = "Gifts";
const P = "Promo";
const C = "Consumables";

export const STOCK_CATEGORIES = [D, S, G, P, C];

const raw = [
  { name: "Water Bottle 500ml", variant: "White", category: D, qty: 0, low: 8 },
  { name: "Water Bottle 500ml", variant: "Black", category: D, qty: 0, low: 8 },
  { name: "Water Bottle 500ml", variant: "Pink", category: D, qty: 0, low: 8 },
  { name: "Water Bottle 500ml", variant: "Sage", category: D, qty: 0, low: 8 },
  { name: "Water Bottle 500ml", variant: "Navy", category: D, qty: 0, low: 8 },
  { name: "Travel Tumbler", variant: "Sage", category: D, qty: 0, low: 6 },
  { name: "Travel Tumbler", variant: "Black", category: D, qty: 0, low: 6 },
  { name: "Travel Tumbler", variant: "White", category: D, qty: 0, low: 6 },
  { name: "Travel Tumbler", variant: "Navy", category: D, qty: 0, low: 6 },
  { name: "Travel Tumbler", variant: "Blush", category: D, qty: 0, low: 6 },
  { name: "Ceramic Mug", variant: "White", category: D, qty: 0, low: 10 },
  { name: "Ceramic Mug", variant: "Navy", category: D, qty: 0, low: 6 },
  { name: "Business Bottle", variant: "Silver", category: D, qty: 0, low: 6 },
  { name: "Acrylic Plaque Blank", variant: "A5", category: S, qty: 0, low: 10 },
  { name: "Acrylic Plaque Blank", variant: "A6", category: S, qty: 0, low: 10 },
  { name: "Acrylic Block Sign", variant: "A5", category: S, qty: 0, low: 6 },
  { name: "Wooden Base", variant: "Small", category: S, qty: 0, low: 10 },
  { name: "Oak Display Stand", variant: "Small", category: S, qty: 0, low: 10 },
  { name: "NFC Chip", variant: "NTAG215 sticker", category: S, qty: 0, low: 50 },
  { name: "NFC Business Card", variant: "Blank PVC", category: S, qty: 0, low: 25 },
  { name: "Wooden Heart Blank", variant: "with ribbon", category: G, qty: 0, low: 6 },
  { name: "Mini Easel Stand", variant: "Small", category: G, qty: 0, low: 6 },
  { name: "Keyring Blank", variant: "Wood", category: G, qty: 0, low: 10 },
  { name: "Keyring Blank", variant: "Acrylic", category: G, qty: 0, low: 10 },
  { name: "Split Ring + Leather Tab", variant: "Standard", category: G, qty: 0, low: 20 },
  { name: "Coaster Blank", variant: "Round", category: G, qty: 0, low: 12 },
  { name: "Coaster Blank", variant: "Square", category: G, qty: 0, low: 12 },
  { name: "Golf Balls", variant: "White", category: G, qty: 0, low: 12 },
  { name: "Phone Case", variant: "iPhone 15", category: G, qty: 0, low: 4 },
  { name: "Phone Case", variant: "iPhone 14", category: G, qty: 0, low: 4 },
  { name: "Phone Case", variant: "iPhone 13", category: G, qty: 0, low: 4 },
  { name: "Phone Case", variant: "Samsung S24", category: G, qty: 0, low: 4 },
  { name: "Phone Case", variant: "Samsung S23", category: G, qty: 0, low: 4 },
  { name: "Pen", variant: "White", category: P, qty: 0, low: 20 },
  { name: "Pen", variant: "Black", category: P, qty: 0, low: 20 },
  { name: "Pen", variant: "Navy", category: P, qty: 0, low: 20 },
  { name: "Pen", variant: "Teal", category: P, qty: 0, low: 20 },
  { name: "Pen", variant: "Red", category: P, qty: 0, low: 20 },
  { name: "UV Ink", variant: "CMYK set", category: C, qty: 0, low: 1 },
  { name: "UV Ink", variant: "White", category: C, qty: 0, low: 1 },
  { name: "UV Ink", variant: "Varnish", category: C, qty: 0, low: 1 },
  { name: "UV-DTF Film", variant: "A4", category: C, qty: 0, low: 20 },
  { name: "UV-DTF Film", variant: "A3", category: C, qty: 0, low: 20 },
  { name: "Laminate / Adhesive", variant: "Roll", category: C, qty: 0, low: 2 },
  { name: "Cleaning Kit", variant: "Flatbed", category: C, qty: 0, low: 1 },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const STOCK_SEED = raw.map((r, i) => ({
  ...r,
  id: `${slug(r.name)}--${slug(r.variant)}`,
  position: i,
}));
