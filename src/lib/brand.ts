/**
 * Central brand config. The name is a PLACEHOLDER ("TayMade Studio").
 * Change it here once and it updates across the whole site.
 */
export const brand = {
  name: "TayMade",
  script: "Studio",
  tagline: "Made for you.",
  heroSub:
    "Personalised gifts, clothing and business printing — designed and produced in Dundee.",
  blurb:
    "Personalised gifts, clothing and business printing — proudly designed and produced in Dundee.",
  announcement: {
    left: "Free local collection in Dundee",
    right: "UK delivery available",
  },
  contact: {
    address: ["Unit 3, Dock Street", "Dundee, DD1 3PS"],
    phone: "01382 123 456",
    email: "hello@taymadestudio.co.uk",
    hours: ["Mon–Fri: 9am–5pm", "Sat: 10am–2pm"],
  },
  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
    email: "mailto:hello@taymadestudio.co.uk",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  menu?: { label: string; href: string }[];
};

export const navItems: NavItem[] = [
  {
    label: "Personalised Gifts",
    href: "/personalised",
    menu: [
      { label: "All Personalised", href: "/personalised" },
      { label: "Clothing", href: "/personalised/clothing" },
      { label: "Bottles & Tumblers", href: "/personalised/bottles-tumblers" },
      { label: "Weddings", href: "/personalised/weddings" },
      { label: "Sports & Clubs", href: "/personalised/sports-clubs" },
    ],
  },
  { label: "Clothing", href: "/personalised/clothing" },
  { label: "Bottles & Tumblers", href: "/personalised/bottles-tumblers" },
  {
    label: "Business",
    href: "/business",
    menu: [
      { label: "Business Printing", href: "/business" },
      { label: "NFC & QR", href: "/nfc-qr" },
      { label: "Best Sellers", href: "/best-sellers" },
    ],
  },
  { label: "NFC & QR", href: "/nfc-qr" },
  { label: "Weddings", href: "/personalised/weddings" },
  { label: "Sports & Clubs", href: "/personalised/sports-clubs" },
  { label: "UV-DTF", href: "/uv-dtf" },
];
