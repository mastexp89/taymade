import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "How it works",
  description: "Choose a product, personalise it, approve your design, and collect or have it delivered.",
};

export default function HowItWorksPage() {
  return (
    <ContentPage title="How it works" subtitle="From idea to finished product in a few simple steps.">
      <h2>1. Choose your product</h2>
      <p>Browse the range and pick something you love — a gift, clothing, an NFC/QR product, signage and more. Not sure? <Link href="/contact">Ask us</Link> and we&apos;ll point you in the right direction.</p>

      <h2>2. Personalise it</h2>
      <p>Add a name, your own message, a date, or upload a photo or logo. Choose fonts, colours and options as you go — and see a live preview update as you type.</p>

      <h2>3. Approve your design</h2>
      <p>For custom and business orders we&apos;ll send a proof for you to check before we make anything. Nothing goes into production until you&apos;re happy.</p>

      <h2>4. We make it</h2>
      <p>We print, press or craft your order in-house here in Dundee. Most orders are ready within <strong>3–5 working days</strong>; larger or bulk business orders may take a little longer — we&apos;ll always let you know.</p>

      <h2>5. Collect or get it delivered</h2>
      <p>Choose <strong>free local collection in Dundee</strong> and we&apos;ll let you know when it&apos;s ready, or have it delivered to your door anywhere in the UK. See <Link href="/delivery-collection">delivery &amp; collection</Link> for details.</p>

      <hr />
      <p>Ordering for a business? Head to <Link href="/business">business printing</Link> or <Link href="/business/quote">request a quote</Link>.</p>
    </ContentPage>
  );
}
