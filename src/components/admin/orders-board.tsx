"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  groupOf,
  nextStatus,
  GROUP_LABEL,
  GROUP_ORDER,
  STATUS_LABEL,
  type AdminOrder,
  type GroupKey,
} from "@/lib/admin/order-status";
import { StatusPill } from "@/components/admin/status-pill";
import { advanceAction } from "@/app/admin/actions";

export function OrdersBoard({ orders }: { orders: AdminOrder[] }) {
  const [filter, setFilter] = useState<GroupKey | "all">("all");
  const [pending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const o of orders) c[groupOf(o.status)] = (c[groupOf(o.status)] ?? 0) + 1;
    return c;
  }, [orders]);

  const visible = filter === "all" ? orders : orders.filter((o) => groupOf(o.status) === filter);
  const active = orders.filter((o) => !["dispatched", "completed"].includes(groupOf(o.status))).length;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">Production board</h1>
          <p className="admin-sub">{active} order{active === 1 ? "" : "s"} in progress · newest first</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
          All <span>{orders.length}</span>
        </button>
        {GROUP_ORDER.map((g) => (
          <button key={g} className={filter === g ? "on" : ""} onClick={() => setFilter(g)}>
            {GROUP_LABEL[g]} <span>{counts[g] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="ord-list" style={pending ? { opacity: 0.6 } : undefined}>
        {visible.map((o) => {
          const next = nextStatus(o.pipeline, o.status);
          const summary = o.items.map((it) => `${it.qty}× ${it.title}`).join(", ");
          return (
            <div className="ord-card" key={o.id}>
              <Link href={`/admin/orders/${o.id}`} className="ord-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.items[0]?.image} alt="" />
              </Link>
              <div className="ord-main">
                <div className="ord-row1">
                  <Link href={`/admin/orders/${o.id}`} className="ord-num">#{o.number}</Link>
                  <span className={`pipe-tag ${o.pipeline}`}>{o.pipeline === "uv" ? "UV / Print" : "Clothing"}</span>
                  {o.proof === "pending" && <span className="flag warn">Proof pending</span>}
                  {o.status === "ARTWORK_REQUIRED" && <span className="flag warn">Needs artwork</span>}
                </div>
                <div className="ord-cust">{o.company ?? o.customer}</div>
                <div className="ord-items">{summary}</div>
              </div>
              <div className="ord-right">
                <div className="ord-meta">
                  <span className={`fulfil-tag ${o.fulfilment}`}>{o.fulfilment === "collection" ? "Collect" : "Deliver"}</span>
                  <span className="ord-date">{o.createdLabel}</span>
                </div>
                <StatusPill status={o.status} />
                {next ? (
                  <button
                    className="ord-advance"
                    disabled={pending}
                    onClick={() => startTransition(() => advanceAction(o.id, o.pipeline, o.status))}
                  >
                    Advance → {STATUS_LABEL[next]}
                  </button>
                ) : (
                  <span className="ord-doneflag">Done</span>
                )}
              </div>
            </div>
          );
        })}
        {visible.length === 0 && <p className="admin-empty">No orders in this stage.</p>}
      </div>
    </>
  );
}
