import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "@/components/icons";
import { categoryMeta } from "@/lib/catalog";
import { getProductsByCategory } from "@/lib/catalog-db";

type Crumb = { label: string; href: string };

export async function CategoryView({
  token,
  crumbs = [],
  showQuote = false,
}: {
  token: string;
  crumbs?: Crumb[];
  showQuote?: boolean;
}) {
  const meta = categoryMeta[token];
  const products = await getProductsByCategory(token);

  return (
    <div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {crumbs.map((c) => (
          <span key={c.href}>
            <span>›</span>
            <Link href={c.href}>{c.label}</Link>
          </span>
        ))}
        <span>›</span>
        {meta?.title ?? token}
      </nav>

      <header className="page-head">
        <div className="eyebrow">{meta?.side === "business" ? "For business" : "Personalised"}</div>
        <h1>{meta?.title ?? token}</h1>
        {meta?.subtitle && <p>{meta.subtitle}</p>}
        {showQuote && (
          <div style={{ marginTop: 18 }}>
            <Link className="btn btn-teal" href="/business/quote">
              Get a Business Quote <ArrowRight />
            </Link>
          </div>
        )}
      </header>

      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="empty">
          Products in this category are coming soon.{" "}
          <Link href="/custom" style={{ color: "var(--teal-deep)", fontWeight: 600 }}>
            Ask us for something custom →
          </Link>
        </p>
      )}
    </div>
  );
}
