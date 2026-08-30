import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How TayMade collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy policy" subtitle={`How ${brand.name} ${brand.script} handles your information.`}>
      <p className="muted">Last updated: 2026. This is a plain-English summary of how we use your data.</p>

      <h2>Who we are</h2>
      <p>{brand.name} {brand.script}, {brand.contact.address.join(", ")}. If you have any questions about your data, email <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Order details</strong> — your name, email, phone, delivery address, and the personalisation you provide (text, options, and any photos or logos you upload).</li>
        <li><strong>Enquiries</strong> — the details you send through our contact or quote forms.</li>
        <li><strong>Basic technical data</strong> — standard server logs, and a login cookie for staff accessing the admin area.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To make and fulfil your order, and to contact you about it.</li>
        <li>To respond to your enquiries and quotes.</li>
        <li>To keep records of orders and to improve our service.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We only share what&apos;s necessary to fulfil your order — for example a delivery courier, or a payment processor when paying by card. We don&apos;t sell your data to anyone.</p>

      <h2>How long we keep it</h2>
      <p>We keep order records for as long as needed to run the business and meet our legal obligations, then remove them.</p>

      <h2>Your rights</h2>
      <p>Under UK data protection law you can ask to see the data we hold about you, correct it, or have it deleted. Just email <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a> and we&apos;ll help.</p>

      <hr />
      <p className="muted">This is a starting template and should be reviewed to make sure it fits your business before you rely on it.</p>
    </ContentPage>
  );
}
