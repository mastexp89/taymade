"use client";

import { useState, useTransition } from "react";
import { updateStockAction } from "@/app/admin/actions";
import type { StockItem } from "@/lib/stock-db";

export function StockEditor({ items, categories }: { items: StockItem[]; categories: string[] }) {
  const [rows, setRows] = useState<StockItem[]>(items);
  const [, startTransition] = useTransition();

  const lowCount = rows.filter((s) => s.qty <= s.low).length;

  const setLocal = (id: string, patch: Partial<StockItem>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const persist = (id: string, patch: { qty?: number; low?: number }) =>
    startTransition(() => updateStockAction(id, patch));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">Blank stock</h1>
          <p className="admin-sub">
            {rows.length} lines · {lowCount} to order. Set the numbers as stock arrives — changes save automatically.
          </p>
        </div>
      </div>

      {categories.map((cat) => {
        const catRows = rows.filter((s) => s.category === cat);
        if (!catRows.length) return null;
        return (
          <div className="admin-card" key={cat} style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
            <div className="stock-cat">{cat}</div>
            <table className="admin-table">
              <thead>
                <tr><th>Item</th><th>Variant</th><th style={{ width: 110 }}>In stock</th><th style={{ width: 120 }}>Reorder at</th><th style={{ width: 130 }}>Status</th></tr>
              </thead>
              <tbody>
                {catRows.map((s) => {
                  const isLow = s.qty <= s.low;
                  return (
                    <tr key={s.id}>
                      <td className="strong">{s.name}</td>
                      <td>{s.variant}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          className="stock-input"
                          value={s.qty}
                          aria-label={`${s.name} ${s.variant} in stock`}
                          onChange={(e) => setLocal(s.id, { qty: Math.max(0, Number(e.target.value) || 0) })}
                          onBlur={(e) => persist(s.id, { qty: Math.max(0, Number(e.target.value) || 0) })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          className="stock-input muted-input"
                          value={s.low}
                          aria-label={`${s.name} ${s.variant} reorder level`}
                          onChange={(e) => setLocal(s.id, { low: Math.max(0, Number(e.target.value) || 0) })}
                          onBlur={(e) => persist(s.id, { low: Math.max(0, Number(e.target.value) || 0) })}
                        />
                      </td>
                      <td>
                        {isLow
                          ? <span className="status-pill s-artwork">{s.qty === 0 ? "To order" : "Low"}</span>
                          : <span className="status-pill s-ready">In stock</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
      <p className="admin-note">Stock auto-deducts as orders progress (coming with production automation). Clothing blanks aren&apos;t tracked here — ordered per job alongside the DTF prints.</p>
    </>
  );
}
