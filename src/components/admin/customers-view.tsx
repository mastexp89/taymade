"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { StatusPill } from "@/components/admin/status-pill";
import { priceGBP } from "@/lib/catalog";
import type { CustomerRow } from "@/lib/customers-db";

type Filter = "all" | "personal" | "business";

export function CustomersView({ customers }: { customers: CustomerRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openEmail, setOpenEmail] = useState<string | null>(null);

  const businessCount = customers.filter((c) => c.isBusiness).length;
  const revenue = customers.reduce((s, c) => s + c.totalSpent, 0);

  const q = query.toLowerCase().trim();
  const visible = customers.filter((c) => {
    if (filter === "business" && !c.isBusiness) return false;
    if (filter === "personal" && c.isBusiness) return false;
    if (q && !(`${c.name} ${c.email} ${c.company ?? ""}`.toLowerCase().includes(q))) return false;
    return true;
  });

  if (!customers.length) {
    return (
      <>
        <div className="admin-head">
          <div>
            <h1 className="admin-h1">Customers</h1>
            <p className="admin-sub">People and businesses who order from you.</p>
          </div>
        </div>
        <div className="admin-card" style={{ padding: 28 }}>
          <p className="prod-cell-sub" style={{ fontSize: 14 }}>
            No customers yet. As soon as orders come in, everyone who orders will appear here with their history and
            total spend.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">Customers</h1>
          <p className="admin-sub">
            {customers.length} {customers.length === 1 ? "customer" : "customers"} · {businessCount} business ·{" "}
            {priceGBP(revenue)} lifetime revenue
          </p>
        </div>
      </div>

      <div className="prod-toolbar">
        <div className="seg">
          {(["all", "personal", "business"] as Filter[]).map((f) => (
            <button key={f} type="button" className={`seg-btn ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "personal" ? "Personal" : `Business (${businessCount})`}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="prod-search"
          placeholder="Search name, email or company…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="admin-table prod-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th style={{ width: 90 }}>Orders</th>
              <th style={{ width: 90 }}>Open</th>
              <th style={{ width: 120 }}>Total spent</th>
              <th style={{ width: 120 }}>Last order</th>
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => {
              const isOpen = openEmail === c.email;
              return (
                <Fragment key={c.email}>
                  <tr>
                    <td>
                      <div className="cust-cell">
                        <span className="cust-avatar" aria-hidden="true">{initials(c.name)}</span>
                        <div>
                          <div className="strong">
                            {c.name}
                            {c.isBusiness && <span className="cust-tag">Business</span>}
                          </div>
                          <div className="prod-cell-sub">
                            {c.company ? `${c.company} · ` : ""}
                            <a className="file-link" href={`mailto:${c.email}`}>{c.email}</a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="strong">{c.orderCount}</td>
                    <td>{c.openOrders > 0 ? <span className="status-pill s-prod">{c.openOrders}</span> : <span className="prod-cell-sub">—</span>}</td>
                    <td className="strong">{priceGBP(c.totalSpent)}</td>
                    <td>{c.lastOrderLabel}</td>
                    <td>
                      <button type="button" className="file-btn" onClick={() => setOpenEmail(isOpen ? null : c.email)}>
                        {isOpen ? "Hide" : "Orders"}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="prod-edit-row">
                      <td colSpan={6}>
                        <div className="cust-orders">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th style={{ width: 90 }}>Order</th>
                                <th style={{ width: 140 }}>Date</th>
                                <th>Status</th>
                                <th style={{ width: 110 }}>Total</th>
                                <th style={{ width: 90 }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {c.orders.map((o) => (
                                <tr key={o.number}>
                                  <td className="strong">#{o.number}</td>
                                  <td>{o.dateLabel}</td>
                                  <td><StatusPill status={o.statusKey} /></td>
                                  <td>{priceGBP(o.total)}</td>
                                  <td>
                                    <Link className="file-link" href={`/admin/orders/${o.id}`}>View →</Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!visible.length && (
              <tr>
                <td colSpan={6} className="prod-cell-sub" style={{ padding: 24 }}>No customers match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="admin-note">
        Built from order history (grouped by email). Business customers are matched from quote enquiries. Customer
        logins, saved branding and 1-click reordering come with the accounts phase.
      </p>
    </>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}
