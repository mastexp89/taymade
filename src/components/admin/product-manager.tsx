"use client";

import { Fragment, useState, useTransition } from "react";
import { updateProductAction } from "@/app/admin/actions";
import type { AdminProduct, ProductPatch } from "@/lib/catalog-db";

type Filter = "all" | "personal" | "business" | "hidden";

export function ProductManager({ items }: { items: AdminProduct[] }) {
  const [rows, setRows] = useState<AdminProduct[]>(items);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, "saving" | "saved" | "error">>({});
  const [, startTransition] = useTransition();

  const setLocal = (slug: string, patch: Partial<AdminProduct>) =>
    setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, ...patch } : r)));

  const persist = (slug: string, patch: ProductPatch) => {
    setSaved((s) => ({ ...s, [slug]: "saving" }));
    startTransition(async () => {
      const res = await updateProductAction(slug, patch);
      setSaved((s) => ({ ...s, [slug]: res?.ok ? "saved" : "error" }));
      if (res?.ok) setTimeout(() => setSaved((s) => ({ ...s, [slug]: undefined as never })), 1600);
    });
  };

  const q = query.toLowerCase().trim();
  const visible = rows.filter((r) => {
    if (filter === "hidden" && r.active) return false;
    if (filter === "personal" && r.side !== "personal") return false;
    if (filter === "business" && r.side !== "business") return false;
    if (q && !(`${r.name} ${r.slug} ${r.category}`.toLowerCase().includes(q))) return false;
    return true;
  });

  const hiddenCount = rows.filter((r) => !r.active).length;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">Products</h1>
          <p className="admin-sub">
            {rows.length} products · {hiddenCount} hidden. Prices, lead times and visibility save automatically and go
            live on the storefront straight away.
          </p>
        </div>
      </div>

      <div className="prod-toolbar">
        <div className="seg">
          {(["all", "personal", "business", "hidden"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={`seg-btn ${filter === f ? "on" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "personal" ? "Personal" : f === "business" ? "Business" : `Hidden (${hiddenCount})`}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="prod-search"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="admin-table prod-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style={{ width: 120 }}>Price (£)</th>
              <th style={{ width: 110 }}>Lead (days)</th>
              <th style={{ width: 100 }}>Best seller</th>
              <th style={{ width: 100 }}>Visible</th>
              <th style={{ width: 130 }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const state = saved[p.slug];
              const isOpen = openSlug === p.slug;
              return (
                <Fragment key={p.slug}>
                  <tr className={p.active ? "" : "row-hidden"}>
                    <td>
                      <div className="prod-cell">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="prod-admin-thumb" src={p.image} alt="" />
                        <div>
                          <div className="strong">{p.name}</div>
                          <div className="prod-cell-sub">{p.category || p.side}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        className="stock-input"
                        value={p.price}
                        aria-label={`${p.name} price`}
                        onChange={(e) => setLocal(p.slug, { price: Math.max(0, Number(e.target.value) || 0) })}
                        onBlur={(e) => persist(p.slug, { price: Math.max(0, Number(e.target.value) || 0) })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        className="stock-input muted-input"
                        value={p.leadTimeDays}
                        aria-label={`${p.name} lead time`}
                        onChange={(e) => setLocal(p.slug, { leadTimeDays: Math.max(0, Number(e.target.value) || 0) })}
                        onBlur={(e) => persist(p.slug, { leadTimeDays: Math.max(0, Number(e.target.value) || 0) })}
                      />
                    </td>
                    <td>
                      <Toggle
                        on={p.bestSeller}
                        label={`${p.name} best seller`}
                        onChange={(v) => { setLocal(p.slug, { bestSeller: v }); persist(p.slug, { bestSeller: v }); }}
                      />
                    </td>
                    <td>
                      <Toggle
                        on={p.active}
                        label={`${p.name} visible`}
                        onChange={(v) => { setLocal(p.slug, { active: v }); persist(p.slug, { active: v }); }}
                      />
                    </td>
                    <td>
                      <div className="prod-row-actions">
                        <span className={`save-tag ${state ?? ""}`}>
                          {state === "saving" ? "Saving…" : state === "saved" ? "Saved ✓" : state === "error" ? "Error" : ""}
                        </span>
                        <button type="button" className="file-btn" onClick={() => setOpenSlug(isOpen ? null : p.slug)}>
                          {isOpen ? "Close" : "Edit text"}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="prod-edit-row">
                      <td colSpan={6}>
                        <DetailsEditor
                          product={p}
                          onSave={(patch) => { setLocal(p.slug, patch); persist(p.slug, patch); }}
                          saving={state === "saving"}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!visible.length && (
              <tr>
                <td colSpan={6} className="prod-cell-sub" style={{ padding: 24 }}>No products match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="admin-note">
        Product images, personalisation options and categories are part of the core catalogue and aren&apos;t edited
        here yet — ask Dylan to add or change those. Hiding a product removes it from the shop immediately but keeps its
        past orders intact.
      </p>
    </>
  );
}

function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`switch ${on ? "on" : ""}`}
      onClick={() => onChange(!on)}
    >
      <span className="knob" />
    </button>
  );
}

function DetailsEditor({
  product,
  onSave,
  saving,
}: {
  product: AdminProduct;
  onSave: (patch: ProductPatch) => void;
  saving: boolean;
}) {
  const [name, setName] = useState(product.name);
  const [shortDesc, setShortDesc] = useState(product.shortDesc);
  const [description, setDescription] = useState(product.description);

  const dirty = name !== product.name || shortDesc !== product.shortDesc || description !== product.description;

  return (
    <div className="prod-details">
      <div className="field">
        <label>Product name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Short description <span className="prod-cell-sub">(shown on cards & at the top of the page)</span></label>
        <input type="text" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
      </div>
      <div className="field">
        <label>Full description <span className="prod-cell-sub">(the &ldquo;About this product&rdquo; section)</span></label>
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <button
          type="button"
          className="btn btn-teal"
          disabled={!dirty || saving}
          onClick={() => onSave({ name: name.trim(), shortDesc: shortDesc.trim(), description: description.trim() })}
        >
          {saving ? "Saving…" : "Save text"}
        </button>
      </div>
    </div>
  );
}
