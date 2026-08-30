import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Custom orders",
  description: "Can't find what you need? Tell us what you'd like made and we'll quote it.",
};

export default function CustomPage() {
  return (
    <ContentPage
      title="Can't find what you need?"
      subtitle="Tell us what you'd like made and we'll quote it — no idea is too big or too small."
    >
      <p className="lead">
        We make far more than we can list. If you&apos;ve got a product, a design, or an idea in mind,
        send us the details below — the more you tell us (quantities, sizes, colours, a rough
        deadline), the quicker we can come back with options and pricing.
      </p>
      <div style={{ maxWidth: "34rem" }}>
        <ContactForm />
      </div>
      <p className="muted" style={{ marginTop: 14 }}>
        Prefer to attach artwork or a reference image? Mention it in your message and we&apos;ll reply
        with an email address to send it to (file uploads on this form are coming soon).
      </p>
    </ContentPage>
  );
}
