import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { ContactForm } from "@/components/contact-form";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the TayMade team in Dundee.",
};

export default function ContactPage() {
  return (
    <ContentPage title="Contact us" subtitle="We'd love to hear from you — whether it's a question, a custom idea, or a business enquiry.">
      <div className="contact-grid">
        <div className="contact-details">
          <h2>Get in touch</h2>
          <p>📍 <span>{brand.contact.address.join(", ")}</span></p>
          <p>📞 <a href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}>{brand.contact.phone}</a></p>
          <p>✉️ <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a></p>
          <p>🕘 <span>{brand.contact.hours.join(" · ")}</span></p>
          <hr />
          <p className="muted">
            Looking for bulk or business pricing? Use the{" "}
            <Link href="/business/quote">business quote form</Link> and we&apos;ll come back with options.
          </p>
        </div>
        <div>
          <h2>Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </ContentPage>
  );
}
