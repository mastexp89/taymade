import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about ordering, personalisation, delivery and business printing.",
};

const faqs = [
  { q: "How long will my order take?", a: "Most orders are ready within 3–5 working days. Personalised clothing and larger business orders can take a little longer — if you have a deadline, just tell us." },
  { q: "Can I collect my order?", a: "Yes — free local collection in Dundee is available at checkout. We'll email you when it's ready." },
  { q: "How do I personalise a product?", a: "Open any product, add your name, message, date, photo or logo, and choose your options. A live preview updates as you type, then add it to your basket." },
  { q: "What image should I upload for a logo or photo?", a: "For the sharpest result, upload a high-resolution image or a transparent PNG. For logos, a vector file (SVG or PDF) is ideal. Not sure? Send it over and we'll check it." },
  { q: "Do you make products for businesses?", a: "Absolutely — workwear, NFC & QR products, Google review plaques, signage, branded bottles and more. See business printing or request a quote for bulk pricing." },
  { q: "How do NFC & QR products work?", a: "Customers tap their phone on the NFC chip, or scan the printed QR code, to open your link — a menu, Google review page, Wi-Fi, or your website. You give us the link and we program it." },
  { q: "Will I see a proof before you make it?", a: "For custom and business orders, yes — we'll send a proof to approve before anything goes into production." },
  { q: "Can I return a personalised item?", a: "Personalised items can't usually be returned unless faulty or we've made an error. See our returns & refunds page for the full details." },
  { q: "What payment do you accept?", a: "We'll confirm your order by email and arrange payment. Card payment online is being added — for now we sort payment on collection or by invoice." },
];

export default function FaqPage() {
  return (
    <ContentPage title="Frequently asked questions" subtitle="Can't find your answer? Just ask us.">
      {faqs.map((f) => (
        <div className="faq-item" key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
      <hr />
      <p>Still stuck? <Link href="/contact">Contact us</Link> or email <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>.</p>
    </ContentPage>
  );
}
