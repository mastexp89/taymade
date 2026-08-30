import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { bestSellers } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "Our most-loved personalised products and business printing.",
};

export default function BestSellersPage() {
  return (
    <div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        Best Sellers
      </nav>
      <header className="page-head">
        <div className="eyebrow">Most loved</div>
        <h1>Best Sellers</h1>
        <p>The products our customers order again and again.</p>
      </header>
      <div className="product-grid">
        {bestSellers.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
