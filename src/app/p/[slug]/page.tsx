import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductConfigurator } from "@/components/product/product-configurator";
import { getProduct, allProductSlugs } from "@/lib/catalog";

export function generateStaticParams() {
  return allProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: { images: [{ url: product.image }] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const listing = product.side === "business"
    ? { label: "Business", href: "/business" }
    : { label: "Personalised", href: "/personalised" };

  return (
    <div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href={listing.href}>{listing.label}</Link>
        <span>›</span>
        {product.name}
      </nav>

      <ProductConfigurator product={product} />

      {product.description && (
        <div className="pdp-longdesc">
          <div className="pdp-section-title">About this product</div>
          {product.description}
        </div>
      )}
    </div>
  );
}
