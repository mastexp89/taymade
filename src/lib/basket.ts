/**
 * Lightweight client-side basket (localStorage) so the personaliser works
 * end-to-end today. The full basket page + Stripe checkout is the next phase;
 * this same shape will post to the server order API then.
 */
"use client";

export type BasketItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  personalisation: { label: string; value: string; uploadId?: string }[];
};

const KEY = "taymade.basket.v1";
const EVENT = "basket:change";

export function readBasket(): BasketItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BasketItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: BasketItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode / storage blocked — basket just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function addToBasket(item: BasketItem) {
  const items = readBasket();
  items.push(item);
  write(items);
}

export function updateQty(id: string, qty: number) {
  const items = readBasket().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  write(items);
}

export function removeFromBasket(id: string) {
  write(readBasket().filter((i) => i.id !== id));
}

export function clearBasket() {
  write([]);
}

export function basketCount(): number {
  return readBasket().reduce((n, i) => n + i.qty, 0);
}

export function basketSubtotal(): number {
  return readBasket().reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
}

export function onBasketChange(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler); // sync across tabs
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
