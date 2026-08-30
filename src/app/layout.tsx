import type { Metadata } from "next";
import { Poppins, Figtree, Dancing_Script, Caveat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { brand } from "@/lib/brand";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${brand.name} ${brand.script} — Personalised gifts & business printing in Dundee`,
    template: `%s · ${brand.name} ${brand.script}`,
  },
  description:
    "Personalised gifts, clothing and business printing — NFC & QR products, workwear and more, designed and produced in Dundee.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${poppins.variable} ${figtree.variable} ${dancing.variable} ${caveat.variable} ${playfair.variable} antialiased`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
