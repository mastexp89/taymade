import Stripe from "stripe";
import { getProduct } from "@/lib/catalog";

type IncomingItem = {
  slug: string;
  qty: number;
  personalisation?: { label: string; value: string }[];
};

const DELIVERY_PENCE = 495; // £4.95 UK delivery

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return Response.json(
      { error: "Checkout isn't set up yet. Add your Stripe secret key (STRIPE_SECRET_KEY) to .env to enable payments." },
      { status: 400 },
    );
  }

  let body: { items?: IncomingItem[]; fulfilment?: "collection" | "delivery" };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = body.items ?? [];
  const delivery = body.fulfilment === "delivery";
  if (!items.length) {
    return Response.json({ error: "Your basket is empty." }, { status: 400 });
  }

  // Re-price from the catalogue on the server — never trust client prices.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const item of items) {
    const product = getProduct(item.slug);
    if (!product) continue;
    const qty = Math.max(1, Math.min(999, Math.floor(item.qty) || 1));
    const description = (item.personalisation ?? [])
      .filter((p) => p.value?.trim())
      .map((p) => `${p.label}: ${p.value}`)
      .join(" · ")
      .slice(0, 480);

    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "gbp",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          ...(description ? { description } : {}),
        },
      },
    });
  }

  if (!lineItems.length) {
    return Response.json({ error: "No valid items in basket." }, { status: 400 });
  }

  const stripe = new Stripe(key);
  const origin = new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/basket`,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      metadata: { fulfilment: delivery ? "delivery" : "collection" },
      ...(delivery
        ? {
            shipping_address_collection: { allowed_countries: ["GB"] },
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: DELIVERY_PENCE, currency: "gbp" },
                  display_name: "UK delivery",
                },
              },
            ],
          }
        : {}),
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return Response.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
