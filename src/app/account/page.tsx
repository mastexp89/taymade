import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Your account",
  description: "Customer accounts are coming soon.",
};

export default function AccountPage() {
  return (
    <ContentPage title="Your account" subtitle="Customer accounts are on the way.">
      <p className="lead">
        Soon you&apos;ll be able to create an account to track your orders, reorder your favourites in a
        click, and save your details for faster checkout.
      </p>
      <p>
        In the meantime you can order as a guest — just add items to your{" "}
        <Link href="/basket">basket</Link> and check out. For business ordering, use the{" "}
        <Link href="/business/quote">business quote form</Link>.
      </p>
    </ContentPage>
  );
}
