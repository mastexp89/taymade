"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  readBasket,
  updateQty,
  removeFromBasket,
  clearBasket,
  onBasketChange,
  type BasketItem,
} from "@/lib/basket";
import { priceGBP } from "@/lib/catalog";
import { ArrowRight } from "@/components/icons";

const DELIVERY_FEE = 4.95;

export function BasketClient() {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [fulfilment, setFulfilment] = useState<"collection" | "delivery">("collection");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setItems(readBasket());
    return onBasketChange(() => setItems(readBasket()));
  }, []);

  if (!mounted) {
    return <div className="page-head"><h1>Basket</h1></div>;
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h1>Your basket is empty</h1>
        <p>Find something to personalise — gifts, clothing, NFC &amp; QR and more.</p>
        <Link className="btn btn-teal" href="/personalised">
          Start shopping <ArrowRight />
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const deliveryFee = fulfilment === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  async function placeOrder() {
    if (!name.trim() || !email.trim()) {
      setError("Please add your name and email so we can process your order.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          fulfilment,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty, personalisation: i.personalisation })),
        }),
      });
      const data = await res.json();
      if (data.number) {
        clearBasket();
        window.location.href = `/checkout/success?order=${data.number}`;
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
        setBusy(false);
      }
    } catch {
      setError("Could not place the order. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        Basket
      </nav>
      <header className="page-head">
        <h1>Your Basket</h1>
      </header>

      <div className="cart">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} />
              </div>
              <div>
                <h3>{item.name}</h3>
                <div className="price-each">{priceGBP(item.unitPrice)} each</div>
                {item.personalisation.length > 0 && (
                  <dl className="perso">
                    {item.personalisation.map((p, idx) => (
                      <div key={idx} style={{ display: "contents" }}>
                        <dt>{p.label}</dt>
                        <dd>
                          {/^#[0-9a-fA-F]{3,8}$/.test(p.value) ? (
                            <>
                              <span className="swatch-dot" style={{ background: p.value }} /> {p.value}
                            </>
                          ) : (
                            p.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              <div className="col-right">
                <div className="line-total">{priceGBP(item.unitPrice * item.qty)}</div>
                <div className="qty">
                  <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    aria-label={`Quantity of ${item.name}`}
                    onChange={(e) => updateQty(item.id, Math.max(1, Number(e.target.value) || 1))}
                  />
                  <button type="button" aria-label="Increase quantity" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <button type="button" className="remove" onClick={() => removeFromBasket(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="fulfil">
            <label data-on={fulfilment === "collection"}>
              <input
                type="radio"
                name="fulfilment"
                checked={fulfilment === "collection"}
                onChange={() => setFulfilment("collection")}
              />
              <span>
                <span className="t">Free local collection</span>
                <span className="s">Collect in Dundee when ready</span>
              </span>
              <span className="amt">Free</span>
            </label>
            <label data-on={fulfilment === "delivery"}>
              <input
                type="radio"
                name="fulfilment"
                checked={fulfilment === "delivery"}
                onChange={() => setFulfilment("delivery")}
              />
              <span>
                <span className="t">UK delivery</span>
                <span className="s">Posted to your door</span>
              </span>
              <span className="amt">{priceGBP(DELIVERY_FEE)}</span>
            </label>
          </div>

          <div className="sumrow"><span>Subtotal</span><span>{priceGBP(subtotal)}</span></div>
          <div className="sumrow"><span>{fulfilment === "delivery" ? "UK delivery" : "Collection"}</span><span>{deliveryFee ? priceGBP(deliveryFee) : "Free"}</span></div>
          <div className="sumrow total"><span>Total</span><span>{priceGBP(total)}</span></div>

          <div className="cart-details">
            <label>
              <span>Your name</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </label>
          </div>

          <button className="btn btn-teal" type="button" onClick={placeOrder} disabled={busy}>
            {busy ? "Placing order…" : <>Place order <ArrowRight /></>}
          </button>

          {error && <div className="cart-error">{error}</div>}

          <p className="cart-note">We&apos;ll confirm your order by email. Card payment (Stripe) switches on once keys are added — for now we&apos;ll arrange payment on collection or by invoice.</p>
        </aside>
      </div>
    </>
  );
}
