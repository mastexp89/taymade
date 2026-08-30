"use client";

import { useState, useTransition } from "react";
import { addStaffAction, resetStaffPasswordAction, toggleStaffActiveAction } from "@/app/admin/actions";
import type { StaffRow } from "@/lib/staff-db";

export function StaffManager({ staff, currentUserId }: { staff: StaffRow[]; currentUserId: string }) {
  const [pending, start] = useTransition();

  // add form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const [addMsg, setAddMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // per-row reset
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [resetPw, setResetPw] = useState("");
  const [rowMsg, setRowMsg] = useState<{ id: string; ok: boolean; text: string } | null>(null);

  function add(e: React.FormEvent) {
    e.preventDefault();
    setAddMsg(null);
    start(async () => {
      const r = await addStaffAction({ name, email, password, isSuperAdmin: isSuper });
      if (r.ok) {
        setAddMsg({ ok: true, text: `Added ${name}.` });
        setName(""); setEmail(""); setPassword(""); setIsSuper(false);
      } else setAddMsg({ ok: false, text: r.error });
    });
  }

  function doReset(id: string) {
    setRowMsg(null);
    start(async () => {
      const r = await resetStaffPasswordAction(id, resetPw);
      if (r.ok) { setRowMsg({ id, ok: true, text: "Password updated." }); setResetFor(null); setResetPw(""); }
      else setRowMsg({ id, ok: false, text: r.error ?? "Couldn't update." });
    });
  }

  function toggle(id: string, active: boolean) {
    start(async () => { await toggleStaffActiveAction(id, !active); });
  }

  return (
    <>
      <div className="admin-card" style={{ padding: 0, overflow: "hidden", marginBottom: 18 }}>
        <div className="stock-cat">Staff accounts</div>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th style={{ width: 220 }}>Actions</th></tr></thead>
          <tbody>
            {staff.map((u) => (
              <tr key={u.id}>
                <td className="strong">{u.name}{u.id === currentUserId ? " (you)" : ""}</td>
                <td>{u.email}</td>
                <td>{u.isSuperAdmin ? <span className="status-pill s-prod">Super Admin</span> : <span className="status-pill s-new">Staff</span>}</td>
                <td>{u.active ? <span className="status-pill s-ready">Active</span> : <span className="status-pill s-done">Disabled</span>}</td>
                <td>
                  <div className="staff-actions">
                    <button className="file-btn" onClick={() => { setResetFor(resetFor === u.id ? null : u.id); setRowMsg(null); }}>Reset password</button>
                    {u.id !== currentUserId && (
                      <button className="file-btn" onClick={() => toggle(u.id, u.active)} disabled={pending}>
                        {u.active ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </div>
                  {resetFor === u.id && (
                    <div className="staff-reset">
                      <input type="text" placeholder="New password (8+ chars)" value={resetPw} onChange={(e) => setResetPw(e.target.value)} className="stock-input" style={{ width: 190 }} />
                      <button className="btn btn-teal" style={{ padding: "7px 12px", fontSize: 13 }} disabled={pending || resetPw.length < 8} onClick={() => doReset(u.id)}>Save</button>
                    </div>
                  )}
                  {rowMsg?.id === u.id && <div className={rowMsg.ok ? "staff-ok" : "staff-err"}>{rowMsg.text}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-h">Add a staff member</h2>
        <form onSubmit={add} className="staff-form">
          <div className="qf-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div className="field"><label>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="field"><label>Temporary password (8+ chars)</label><input type="text" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <div className="field">
              <label>Role</label>
              <div className="chipset">
                <button type="button" className="chip-opt" aria-pressed={!isSuper} onClick={() => setIsSuper(false)}>Staff (Orders, Stock, Enquiries)</button>
                <button type="button" className="chip-opt" aria-pressed={isSuper} onClick={() => setIsSuper(true)}>Super Admin (everything)</button>
              </div>
            </div>
          </div>
          {addMsg && <div className={addMsg.ok ? "staff-ok" : "staff-err"} style={{ marginBottom: 10 }}>{addMsg.text}</div>}
          <button className="btn btn-teal" type="submit" disabled={pending}>Add staff member</button>
        </form>
      </div>
    </>
  );
}
