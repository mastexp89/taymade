import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the TayMade team in Dundee.",
};

export default async function ContactPage() {
  const content = await getSiteContent();
  const address = [content.addressLine1, content.addressLine2].filter(Boolean).join(", ");
  const hours = [content.hours1, content.hours2].filter(Boolean).join(" · ");
  return (
    <ContentPage title="Contact us" subtitle="We'd love to hear from you — whether it's a question, a custom idea, or a business enquiry.">
      <div className="contact-grid">
        <div className="contact-details">
          <h2>Get in touch</h2>
          <p>📍 <span>{address}</span></p>
          <p>📞 <a href={`tel:${content.phone.replace(/\s/g, "")}`}>{content.phone}</a></p>
          <p>✉️ <a href={`mailto:${content.email}`}>{content.email}</a></p>
          <p>🕘 <span>{hours}</span></p>
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
