"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { UploadField } from "@/components/upload-field";

const NEEDS = [
  "Workwear",
  "Clothing",
  "NFC & QR",
  "Bottles",
  "Mugs",
  "Signs",
  "Promotional products",
  "Other",
];

export function QuoteForm() {
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [requiredBy, setRequiredBy] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoUploadId, setLogoUploadId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const toggleNeed = (n: string) =>
    setNeeds((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));

  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!company.trim() || !contact.trim() || !email.trim()) {
      setError("Please add your company, name and email so we can get back to you.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          contact: contact.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          needs,
          quantity: quantity.trim() || undefined,
          requiredBy: requiredBy || undefined,
          logoName: logoName || undefined,
          logoUploadId: logoUploadId || undefined,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(data.error ?? "Could not send your enquiry. Please try again.");
        setBusy(false);
      }
    } catch {
      setError("Could not send your enquiry. Please try again.");
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="quote-done">
        <div className="tick" aria-hidden="true">✓</div>
        <h2>Thanks, {contact.split(" ")[0] || "there"}!</h2>
        <p>Your enquiry is in. We&apos;ll review what you need and get back to you — usually within one working day.</p>
        <p className="admin-sub">A copy has been logged for the team. For anything urgent, call us on 01382 123 456.</p>
        <Link className="btn btn-teal" href="/business">Back to business</Link>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={submit} noValidate>
      <div className="qf-grid">
        <div className="field">
          <label>Company name <span className="req">*</span></label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. The Corner Café" />
        </div>
        <div className="field">
          <label>Contact name <span className="req">*</span></label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Your name" />
        </div>
        <div className="field">
          <label>Email <span className="req">*</span></label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.co.uk" />
        </div>
        <div className="field">
          <label>Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
        </div>
      </div>

      <div className="field">
        <label>What do you need?</label>
        <div className="chipset">
          {NEEDS.map((n) => (
            <button key={n} type="button" className="chip-opt" aria-pressed={needs.includes(n)} onClick={() => toggleNeed(n)}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="qf-grid">
        <div className="field">
          <label>Approximate quantity</label>
          <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 20 units" />
        </div>
        <div className="field">
          <label>Required by</label>
          <input type="date" value={requiredBy} onChange={(e) => setRequiredBy(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Upload your logo (optional)</label>
        <UploadField
          kind="LOGO"
          onUploaded={(u) => {
            setLogoUploadId(u?.id ?? null);
            setLogoName(u?.name ?? "");
          }}
        />
      </div>

      <div className="field">
        <label>Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us a bit about what you're after…" />
      </div>

      {error && <div className="cart-error">{error}</div>}

      <button className="btn btn-teal" type="submit" disabled={busy} style={{ marginTop: 4 }}>
        {busy ? "Sending…" : <>Send enquiry <ArrowRight /></>}
      </button>
      <p className="admin-sub" style={{ marginTop: 12 }}>No obligation — we&apos;ll come back with options and pricing.</p>
    </form>
  );
}
