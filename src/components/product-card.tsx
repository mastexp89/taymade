import Link from "next/link";
import { Stars } from "@/components/icons";
import { priceGBP, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="prod" href={`/p/${product.slug}`}>
      <div className="pic">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
      </div>
      <div className="info">
        <h3>{product.name}</h3>
        <div className="rate">
          <Stars n={product.rating} />
          <span>({product.reviews})</span>
        </div>
        <div className="price">{priceGBP(product.price)}</div>
      </div>
    </Link>
  );
}
