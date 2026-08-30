import Link from "next/link";

export function AdminRestricted() {
  return (
    <div className="admin-empty">
      <h1 className="admin-h1">Restricted</h1>
      <p className="admin-sub">This area is only available to a Super Admin.</p>
      <Link href="/admin" className="admin-link">← Back to the board</Link>
    </div>
  );
}
