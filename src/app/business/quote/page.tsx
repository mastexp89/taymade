import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "@/components/business/quote-form";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Get a business quote",
  description: "Tell us what your business needs — workwear, NFC & QR, signage and promotional products — and we'll come back with options and pricing.",
};

const benefits = [
  { t: "Made in Dundee", d: "Design, print and press all in-house — with free local collection." },
  { t: "Bulk pricing", d: "The more you order, the better the price. Tell us your quantities." },
  { t: "One supplier", d: "Workwear, NFC/QR, signage and promo — all from one place." },
  { t: "Fast turnaround", d: "Most business orders ready within a week. Rush jobs? Just ask." },
];

export default async function QuotePage() {
  const content = await getSiteContent();
  return (
    <div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href="/business">Business</Link>
        <span>›</span>
        Get a quote
      </nav>

      <header className="quote-head">
        <div className="eyebrow teal-eye">For business</div>
        <h1>Get a business quote</h1>
        <p>Tell us what you need and we&apos;ll come back with options and pricing — no obligation. Perfect for workwear, NFC &amp; QR, signage and promotional products.</p>
      </header>

      <div className="quote-layout">
        <div className="quote-card">
          <QuoteForm contactPhone={content.phone} />
        </div>
        <aside className="quote-side">
          <div className="admin-card">
            <h2 className="admin-card-h">Why TayMade for business</h2>
            <ul className="benefit-list">
              {benefits.map((b) => (
                <li key={b.t}>
                  <b>{b.t}</b>
                  <span>{b.d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="admin-card">
            <h2 className="admin-card-h">Prefer to talk?</h2>
            <p className="side-line">📞 {content.phone}</p>
            <p className="side-line">✉️ <a className="admin-link" href={`mailto:${content.email}`}>{content.email}</a></p>
            <p className="side-line admin-sub">{[content.hours1, content.addressLine1, content.addressLine2].filter(Boolean).join(" · ")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
