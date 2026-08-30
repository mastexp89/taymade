import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About us",
  description: `${brand.name} ${brand.script} — personalised gifts, clothing and business printing, designed and produced in Dundee.`,
};

export default function AboutPage() {
  return (
    <ContentPage title="About us" subtitle="Personalised, printed, yours — made in Dundee.">
      <p className="lead">
        {brand.name} {brand.script} is a Dundee-based studio making personalised products and
        business printing under one roof. From a one-off gift with someone&apos;s name on it, to a
        full branded kit for a local business, we design it, make it, and get it to you.
      </p>

      <h2>Two sides, one workshop</h2>
      <p>
        We work with two kinds of customer, and we love both:
      </p>
      <ul>
        <li><strong>Personal</strong> — personalised gifts, clothing, bottles, mugs, signs and keepsakes for birthdays, weddings, new babies, teachers and every occasion in between.</li>
        <li><strong>Business</strong> — branded workwear and clothing, NFC &amp; QR products, Google review plaques, signage, bottles and promotional items that help you stand out.</li>
      </ul>

      <h2>Made here, by us</h2>
      <p>
        Everything is produced in-house on our own equipment — UV printing for hard products
        (bottles, plaques, signs, phone cases and more) and heat-pressed transfers for clothing.
        That means we control the quality, we can turn things around quickly, and you can{" "}
        <strong>collect locally in Dundee for free</strong> or have it delivered across the UK.
      </p>

      <h2>Small, friendly, and here to help</h2>
      <p>
        We&apos;re a small team who care about getting your order right. If you&apos;re not sure what you
        need, or you want something you can&apos;t see on the site, just{" "}
        <Link href="/contact">get in touch</Link> — we&apos;re always happy to help.
      </p>

      <hr />
      <p className="muted">Based at {brand.contact.address.join(", ")}.</p>
    </ContentPage>
  );
}
