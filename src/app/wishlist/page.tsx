import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Save your favourites — coming soon.",
};

export default function WishlistPage() {
  return (
    <ContentPage title="Wishlist" subtitle="Save the things you love.">
      <p className="lead">
        The wishlist is coming soon — you&apos;ll be able to save products (perfect for gift ideas) and
        come back to them later.
      </p>
      <p>
        For now, keep browsing our <Link href="/personalised">personalised gifts</Link> and{" "}
        <Link href="/best-sellers">best sellers</Link>.
      </p>
    </ContentPage>
  );
}
