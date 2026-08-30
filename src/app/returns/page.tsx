import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Returns & refunds",
  description: "Our returns policy for personalised and made-to-order products.",
};

export default function ReturnsPage() {
  return (
    <ContentPage title="Returns & refunds" subtitle="What happens if something isn't right.">
      <p className="lead">
        We want you to love what you order. Because our products are personalised and made to
        order, though, a few things work a little differently to standard shop-bought goods.
      </p>

      <h2>Personalised & made-to-order items</h2>
      <p>
        Personalised items are made specifically for you, so they generally <strong>can&apos;t be
        returned or refunded</strong> unless they&apos;re faulty or we&apos;ve made an error. This is in line
        with your rights on custom-made goods.
      </p>

      <h2>If something&apos;s wrong</h2>
      <p>
        If your order arrives <strong>faulty, damaged, or not as agreed</strong>, please contact us
        within <strong>14 days</strong> of receiving it. Send a photo if you can, and we&apos;ll put it
        right — a replacement or a refund, whichever suits.
      </p>
      <ul>
        <li>A manufacturing fault or damage in transit — we&apos;ll replace or refund it.</li>
        <li>We printed something different to your approved design — that&apos;s on us; we&apos;ll remake it.</li>
        <li>A spelling or detail you supplied and approved on the proof — unfortunately we can&apos;t refund these, so please check your proof carefully.</li>
      </ul>

      <h2>Cancellations</h2>
      <p>
        Get in touch as soon as possible if you need to change or cancel an order. We can usually
        help if we haven&apos;t started making it yet — once production or artwork has begun, we may not
        be able to cancel a personalised item.
      </p>

      <h2>How to get in touch</h2>
      <p>
        Email <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a> with your order
        number and we&apos;ll sort it quickly.
      </p>

      <hr />
      <p className="muted">This policy doesn&apos;t affect your statutory rights.</p>
    </ContentPage>
  );
}
