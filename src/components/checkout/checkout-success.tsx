"use client";

import { useEffect } from "react";
import Link from "next/link";
import { clearBasket } from "@/lib/basket";
import { ArrowRight } from "@/components/icons";

export function CheckoutSuccess({ orderNumber }: { orderNumber?: string }) {
  useEffect(() => {
    clearBasket();
  }, []);

  return (
    <div className="checkout-done">
      <div className="tick" aria-hidden="true">✓</div>
      <h1>Thank you — order received!</h1>
      {orderNumber && (
        <p style={{ fontWeight: 700, color: "var(--ink)" }}>Your order number is #{orderNumber}</p>
      )}
      <p>
        We&apos;ve got your order and it&apos;s now with the team. You&apos;ll get a confirmation email
        shortly, and we&apos;ll be in touch when it&apos;s ready.
      </p>
      <p>Most orders are ready within 3–5 working days. We&apos;ll let you know the moment yours is done.</p>
      <Link className="btn btn-teal" href="/">
        Continue shopping <ArrowRight />
      </Link>
    </div>
  );
}
