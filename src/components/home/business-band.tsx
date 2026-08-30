import Link from "next/link";
import { businessItems } from "@/lib/catalog";
import { ArrowRight } from "@/components/icons";

export function BusinessBand() {
  return (
    <section>
      <div className="wrap">
        <div className="bizband">
          <div>
            <h2>
              Make Your Business <span>Stand Out</span>
            </h2>
            <p>
              High quality branded products and smart NFC &amp; QR solutions that
              leave a lasting impression.
            </p>
            <Link className="btn btn-teal" href="/business/quote">
              Get a Business Quote <ArrowRight />
            </Link>
          </div>
          <div className="biz-cards">
            {businessItems.map((b) => (
              <div className="biz-card" key={b.label}>
                <div className="pic">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={b.label} loading="lazy" decoding="async" />
                </div>
                <div className="lab">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
