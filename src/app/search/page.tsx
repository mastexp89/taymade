import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search",
  description: "Search TayMade products.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").toLowerCase().trim();
  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.shortDesc.toLowerCase().includes(query) ||
          p.categories.some((c) => c.includes(query)),
      )
    : [];

  return (
    <div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        Search
      </nav>
      <header className="page-head">
        <h1>{query ? `Search: “${q}”` : "Search"}</h1>
        <p>
          {query
            ? `${results.length} result${results.length === 1 ? "" : "s"}`
            : "Type in the search bar above to find a product."}
        </p>
      </header>

      {query && results.length > 0 && (
        <div className="product-grid">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <p className="empty">
          Nothing matched “{q}”. Try another word, browse <Link href="/personalised" style={{ color: "var(--teal-deep)", fontWeight: 600 }}>all products</Link>, or{" "}
          <Link href="/custom" style={{ color: "var(--teal-deep)", fontWeight: 600 }}>ask us for something custom</Link>.
        </p>
      )}
    </div>
  );
}
