"use client";

import { useState, useTransition } from "react";
import { changeOwnPasswordAction } from "@/app/admin/actions";

export function AccountForm() {
  const [pending, start] = useTransition();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) { setMsg({ ok: false, text: "New passwords don't match." }); return; }
    if (next.length < 8) { setMsg({ ok: false, text: "New password must be at least 8 characters." }); return; }
    start(async () => {
      const r = await changeOwnPasswordAction(current, next);
      if (r.ok) { setMsg({ ok: true, text: "Password changed." }); setCurrent(""); setNext(""); setConfirm(""); }
      else setMsg({ ok: false, text: r.error ?? "Couldn't change password." });
    });
  }

  return (
    <form onSubmit={submit} className="staff-form">
      <div className="field"><label>Current password</label><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" /></div>
      <div className="field"><label>New password (8+ chars)</label><input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" /></div>
      <div className="field"><label>Confirm new password</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" /></div>
      {msg && <div className={msg.ok ? "staff-ok" : "staff-err"} style={{ marginBottom: 10 }}>{msg.text}</div>}
      <button className="btn btn-teal" type="submit" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
