import Link from "next/link";
import { getBestSellers } from "@/lib/catalog-db";
import { ArrowRight } from "@/components/icons";
import { ProductCard } from "@/components/product-card";

export async function BestSellers() {
  const bestSellers = await getBestSellers();
  return (
    <section style={{ paddingTop: 8 }}>
      <div className="wrap">
        <div className="sec-head">
          <h2>Best Sellers</h2>
          <Link className="link-more" href="/best-sellers">
            View all best sellers <ArrowRight />
          </Link>
        </div>
        <div className="prods">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
