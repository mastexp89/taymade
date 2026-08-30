import type { Metadata } from "next";
import { BasketClient } from "@/components/basket/basket-client";

export const metadata: Metadata = {
  title: "Basket",
  description: "Your TayMade basket.",
};

export default function BasketPage() {
  return (
    <div className="wrap">
      <BasketClient />
    </div>
  );
}
