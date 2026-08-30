import { createOrder } from "@/lib/orders-db";

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    fulfilment?: "collection" | "delivery";
    items?: { slug: string; qty: number; personalisation?: { label: string; value: string; uploadId?: string }[] }[];
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const items = body.items ?? [];

  if (!name || !email) {
    return Response.json({ error: "Please add your name and email." }, { status: 400 });
  }
  if (!/.+@.+\..+/.test(email)) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  if (!items.length) {
    return Response.json({ error: "Your basket is empty." }, { status: 400 });
  }

  try {
    const order = await createOrder({
      name,
      email,
      fulfilment: body.fulfilment === "delivery" ? "delivery" : "collection",
      items,
    });
    return Response.json({ number: order.number, id: order.id });
  } catch (err) {
    console.error("Order create failed", err);
    return Response.json({ error: "Could not place the order. Please try again." }, { status: 500 });
  }
}
