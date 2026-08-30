import Link from "next/link";
import { getSiteContent } from "@/lib/site-content";
import { ArrowRight } from "@/components/icons";

export async function Hero() {
  const content = await getSiteContent();
  return (
    <section className="hero">
      <div className="hero-in">
        <div className="hero-copy">
          <h1>
            Made for <span className="you">You.</span>
          </h1>
          <p>{content.heroSub}</p>
          <div className="hero-cta">
            <Link className="btn btn-teal" href="/personalised">
              Shop Personalised <ArrowRight />
            </Link>
            <Link className="btn btn-outline" href="/business">
              Shop for Business <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
      {/* Shown on mobile, where the text sits above the photo instead of over it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hero-photo"
        src="/products/hero-desk.png"
        alt="Personalised bottle, Dundee sweatshirt, Google review NFC plaque, acrylic family sign and mug on a desk"
      />
    </section>
  );
}
