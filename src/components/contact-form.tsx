"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please add your name, email and a message.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: "Website contact",
          contact: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          needs: ["Contact form"],
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) setDone(true);
      else { setError(data.error ?? "Could not send. Please try again."); setBusy(false); }
    } catch {
      setError("Could not send. Please try again.");
      setBusy(false);
    }
  }

  if (done) {
    return <div className="content-done">Thanks {name.split(" ")[0] || ""}! Your message is in — we&apos;ll get back to you soon.</div>;
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>Your name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>Phone (optional)
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <label>Message
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      {error && <div className="cart-error" style={{ marginTop: 10 }}>{error}</div>}
      <button className="btn btn-teal" type="submit" disabled={busy} style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
