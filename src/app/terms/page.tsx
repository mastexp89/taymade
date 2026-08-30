import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: "The terms that apply when you order from TayMade.",
};

export default function TermsPage() {
  return (
    <ContentPage title="Terms & conditions" subtitle="The basics of ordering from us.">
      <p className="muted">Last updated: 2026.</p>

      <h2>Ordering</h2>
      <p>When you place an order you&apos;re making an offer to buy. We&apos;ll confirm it by email once we&apos;ve accepted it. For custom and business orders we&apos;ll usually send a proof to approve before we start making anything.</p>

      <h2>Personalisation & proofs</h2>
      <p>You&apos;re responsible for the accuracy of the details you provide (spelling, dates, URLs, artwork). Please check your proof carefully — once you&apos;ve approved it, we make it exactly as shown, and we can&apos;t refund errors in details you supplied and approved.</p>

      <h2>Your artwork</h2>
      <p>By uploading a logo, photo or design, you confirm you have the right to use it. We only use your files to produce your order.</p>

      <h2>Pricing & payment</h2>
      <p>Prices are shown on the product pages and may change over time. We&apos;ll confirm the total when we accept your order. Payment is arranged as set out at checkout.</p>

      <h2>Turnaround & delivery</h2>
      <p>Turnaround times are estimates, not guarantees — see <Link href="/delivery-collection">delivery &amp; collection</Link>. We&apos;ll always do our best to meet a deadline you tell us about.</p>

      <h2>Returns</h2>
      <p>Because our products are personalised, returns are limited — please read our <Link href="/returns">returns &amp; refunds</Link> policy. This doesn&apos;t affect your statutory rights.</p>

      <h2>Liability</h2>
      <p>We take care to get your order right. Our liability for any order is limited to the value of that order. Nothing here limits liability that can&apos;t be limited by law.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the law of Scotland.</p>

      <h2>Contact</h2>
      <p>{brand.name} {brand.script}, {brand.contact.address.join(", ")} · <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a></p>

      <hr />
      <p className="muted">This is a starting template and should be reviewed to make sure it fits your business before you rely on it.</p>
    </ContentPage>
  );
}
