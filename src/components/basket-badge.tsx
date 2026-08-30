"use client";

import { useEffect, useState } from "react";
import { basketCount, onBasketChange } from "@/lib/basket";

export function BasketBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(basketCount());
    return onBasketChange(() => setCount(basketCount()));
  }, []);

  return <span className="badge">{count}</span>;
}
