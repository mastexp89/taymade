import Link from "next/link";
import { categories } from "@/lib/catalog";
import { ChevronRight } from "@/components/icons";

export function Categories() {
  return (
    <section>
      <div className="wrap">
        <div className="sec-head">
          <h2>Shop by Category</h2>
        </div>
        <div className="cats">
          {categories.map((c) => (
            <Link className="cat" key={c.slug} href={`/${c.slug}`}>
              <div className="pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} loading="lazy" decoding="async" />
              </div>
              <div className="cat-foot">
                <span className="lab">{c.name}</span>
                <span className="go" style={{ background: c.accent }}>
                  <ChevronRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
