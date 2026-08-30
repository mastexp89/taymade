import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Delivery & collection",
  description: "Free local collection in Dundee and UK delivery. Typical turnaround 3–5 working days.",
};

export default function DeliveryPage() {
  return (
    <ContentPage title="Delivery & collection" subtitle="How and when you'll get your order.">
      <div className="info-cards">
        <div className="info-card">
          <h3>📍 Free local collection</h3>
          <p>Collect from us in Dundee at no charge. We&apos;ll email you the moment your order is ready.</p>
        </div>
        <div className="info-card">
          <h3>🚐 UK delivery</h3>
          <p>Posted to your door anywhere in the UK. Delivery is calculated at checkout.</p>
        </div>
        <div className="info-card">
          <h3>⏱️ Turnaround</h3>
          <p>Most orders are ready within 3–5 working days. Bulk orders may take longer.</p>
        </div>
      </div>

      <h2>Turnaround times</h2>
      <p>Because everything is made to order, please allow <strong>3–5 working days</strong> for most items before collection or dispatch. Personalised clothing and larger business orders can take a little longer — if you have a deadline, tell us and we&apos;ll do our best to help.</p>

      <h2>Collection</h2>
      <p>Choose <strong>Free local collection</strong> at checkout. We&apos;ll send you an email when your order is ready, along with where and when to pick it up. Collection details are at {brand.contact.address.join(", ")}, {brand.contact.hours.join(", ")}.</p>

      <h2>UK delivery</h2>
      <p>Prefer it posted? Choose <strong>UK delivery</strong> at checkout and we&apos;ll send it out once it&apos;s made and quality-checked. You&apos;ll get a confirmation when it&apos;s on its way.</p>

      <h2>Questions about a delivery?</h2>
      <p>Email us at <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a> or call {brand.contact.phone} and we&apos;ll help.</p>
    </ContentPage>
  );
}
