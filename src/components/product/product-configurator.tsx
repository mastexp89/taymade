"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addToBasket } from "@/lib/basket";
import { priceGBP, type Product, type PersonalField } from "@/lib/catalog";
import { ArrowRight, Stars } from "@/components/icons";
import { UploadField } from "@/components/upload-field";

// Maps the font choices to real web fonts loaded in the layout.
const FONT_MAP: Record<string, string> = {
  Script: "var(--font-dancing), cursive",
  Handwritten: "var(--font-caveat), cursive",
  Bold: "var(--font-poppins), sans-serif",
  Classic: "var(--font-playfair), serif",
};

export function ProductConfigurator({ product }: { product: Product }) {
  const initial = useMemo(() => {
    const v: Record<string, string> = {};
    for (const f of product.fields) {
      if ((f.type === "select" || f.type === "colour") && f.options?.length) {
        v[f.key] = f.options[0];
      }
    }
    return v;
  }, [product]);

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [uploads, setUploads] = useState<Record<string, { id: string; name: string }>>({});
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const set = (k: string, val: string) => {
    setValues((s) => ({ ...s, [k]: val }));
    setAdded(false);
  };

  const handleUpload = (key: string, u: { id: string; name: string } | null) => {
    setValues((s) => ({ ...s, [key]: u?.name ?? "" }));
    setUploads((s) => {
      const next = { ...s };
      if (u) next[key] = u; else delete next[key];
      return next;
    });
    setAdded(false);
  };

  const missing = product.fields.filter((f) => f.required && !values[f.key]?.trim());
  const total = product.price * qty;

  const summary = product.fields
    .filter((f) => values[f.key]?.trim())
    .map((f) => ({ field: f, value: values[f.key] }));

  // Live preview: display-text fields only (not sizes/company/links), drawn on
  // the product in the chosen font/colour. Bundles don't get a text preview.
  const PREVIEW_SKIP = new Set(["size", "company", "link", "model", "backName", "number"]);
  const previewFields = product.fields.filter((f) => f.type === "text" && !PREVIEW_SKIP.has(f.key));
  const previewLines = previewFields
    .map((f) => values[f.key]?.trim())
    .filter((v): v is string => !!v);
  const fontFamily = FONT_MAP[values.font] ?? FONT_MAP.Script;
  const textColour = values.textColour ?? "#1E2A2E";
  const hasPreview = !product.bundle && previewFields.length > 0;

  function add() {
    if (missing.length) return;
    addToBasket({
      id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      slug: product.slug,
      name: product.name,
      image: product.image,
      unitPrice: product.price,
      qty,
      personalisation: summary.map((s) => ({
        label: s.field.label,
        value: s.value,
        uploadId: uploads[s.field.key]?.id,
      })),
    });
    setAdded(true);
  }

  return (
    <div className="pdp">
      <div className="pdp-media">
        <div className="pdp-photo">
          {/* Uses the plain preview base (no example name) when provided. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.previewImage ?? product.image} alt={product.name} />
          {hasPreview && (
            <>
              <div className="preview-overlay" aria-hidden="true">
                {previewLines.map((line, i) => (
                  <span
                    key={i}
                    className="preview-line"
                    style={{
                      fontFamily,
                      color: textColour,
                      fontWeight: values.font === "Bold" ? 800 : 600,
                      fontSize: i === 0 ? "clamp(22px,6vw,44px)" : "clamp(14px,3.4vw,24px)",
                    }}
                  >
                    {line}
                  </span>
                ))}
              </div>
              <span className="preview-tag">Live preview</span>
            </>
          )}
        </div>
        <div className="pdp-badges">
          <span className="pill">Usually ready in {product.leadTimeDays}–{product.leadTimeDays + 1} working days</span>
          <span className="pill grey">Free local collection in Dundee</span>
        </div>
      </div>

      <div className="pdp-info">
        <h1>{product.name}</h1>
        <div className="rate">
          <Stars n={product.rating} />
          <span>({product.reviews} reviews)</span>
        </div>
        <div className="pdp-price">
          {product.bundle ? "From " : ""}{priceGBP(product.price)}
        </div>
        <p className="pdp-desc">{product.shortDesc}</p>

        {product.contents && product.contents.length > 0 && (
          <div className="bundle-contents">
            <h4>What&apos;s included</h4>
            <ul>
              {product.contents.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="personaliser">
          <h3>Personalise it</h3>
          <p className="sub">Make it yours — your preview updates as you type.</p>

          {product.fields.map((f) => (
            <div className="field" key={f.key}>
              <label id={`lbl-${f.key}`}>
                {f.label}
                {f.required && <span className="req">*</span>}
              </label>
              <FieldInput field={f} value={values[f.key] ?? ""} onChange={(v) => set(f.key, v)} onUpload={(u) => handleUpload(f.key, u)} />
              {f.help && <div className="help">{f.help}</div>}
            </div>
          ))}

          <div className="field">
            <label>Quantity</label>
            <div className="qtyrow">
              <div className="qty">
                <button type="button" aria-label="Decrease quantity" onClick={() => { setQty((q) => Math.max(1, q - 1)); setAdded(false); }}>−</button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  aria-label="Quantity"
                  onChange={(e) => { setQty(Math.max(1, Number(e.target.value) || 1)); setAdded(false); }}
                />
                <button type="button" aria-label="Increase quantity" onClick={() => { setQty((q) => q + 1); setAdded(false); }}>+</button>
              </div>
              <span style={{ color: "var(--ink-faint)", fontSize: 13.5 }}>{priceGBP(product.price)} each</span>
            </div>
          </div>

          {summary.length > 0 && (
            <div className="summary">
              <h4>YOUR PERSONALISATION</h4>
              <dl>
                {summary.map((s) => (
                  <div key={s.field.key} style={{ display: "contents" }}>
                    <dt>{s.field.label}</dt>
                    <dd>
                      {s.field.type === "colour" ? (
                        <>
                          <span className="swatch-dot" style={{ background: s.value }} />
                          {s.value}
                        </>
                      ) : (
                        s.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="addbar">
            <button
              className="btn btn-teal addbtn"
              type="button"
              onClick={add}
              disabled={missing.length > 0}
              title={missing.length ? `Please add: ${missing.map((m) => m.label).join(", ")}` : undefined}
            >
              Add to basket · {priceGBP(total)} <ArrowRight />
            </button>
          </div>

          {missing.length > 0 && (
            <div className="help" style={{ marginTop: 10 }}>
              Please complete: {missing.map((m) => m.label).join(", ")}.
            </div>
          )}

          {added && (
            <div className="added-note">
              Added to basket ✓
              <Link href="/basket" style={{ color: "var(--teal-deep)", textDecoration: "underline", marginLeft: "auto" }}>
                View basket
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  onUpload,
}: {
  field: PersonalField;
  value: string;
  onChange: (v: string) => void;
  onUpload: (u: { id: string; name: string } | null) => void;
}) {
  switch (field.type) {
    case "textarea":
      return <textarea value={value} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "select":
      return (
        <div className="chipset" role="group" aria-labelledby={`lbl-${field.key}`}>
          {field.options?.map((opt) => (
            <button key={opt} type="button" className="chip-opt" aria-pressed={value === opt} onClick={() => onChange(opt)}>
              {opt}
            </button>
          ))}
        </div>
      );
    case "colour":
      return (
        <div className="swatches" role="group" aria-labelledby={`lbl-${field.key}`}>
          {field.options?.map((hex) => (
            <button key={hex} type="button" className="swatch" style={{ background: hex }} aria-label={hex} aria-pressed={value === hex} onClick={() => onChange(hex)} />
          ))}
        </div>
      );
    case "upload":
      return <UploadField kind={field.key === "logo" ? "LOGO" : "ARTWORK"} onUploaded={onUpload} />;
    case "number":
      return <input type="number" value={value} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "url":
      return <input type="url" value={value} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    default:
      return <input type="text" value={value} placeholder={field.placeholder} maxLength={field.maxLength} onChange={(e) => onChange(e.target.value)} />;
  }
}
