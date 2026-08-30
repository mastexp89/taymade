import { reviews } from "@/lib/catalog";
import { Stars } from "@/components/icons";

function Avatar({ tint, tint2 }: { tint: string; tint2: string }) {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      <rect width="52" height="52" fill={tint} />
      <circle cx="26" cy="20" r="9" fill={tint2} />
      <path d="M8 52c0-12 9-18 18-18s18 6 18 18z" fill={tint2} />
    </svg>
  );
}

export function Reviews() {
  return (
    <section className="reviews-band">
      <div className="wrap">
        <div className="sec-head center">
          <h2>What Our Customers Say</h2>
        </div>
        <div className="revs">
          {reviews.map((r) => (
            <div className="rev" key={r.name}>
              <div className="av">
                <Avatar tint={r.tint} tint2={r.tint2} />
              </div>
              <div>
                <Stars n={r.stars} />
                <p>{r.body}</p>
                <cite>— {r.name}</cite>
              </div>
            </div>
          ))}
        </div>
        <div className="dots" aria-hidden="true">
          <i className="on" />
          <i />
          <i />
        </div>
      </div>
    </section>
  );
}
