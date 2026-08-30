"use client";

import { useTransition } from "react";
import {
  PIPELINES,
  STATUS_LABEL,
  nextStatus,
  type Pipeline,
  type Status,
} from "@/lib/admin/order-status";
import { advanceAction, setStatusAction } from "@/app/admin/actions";

export function OrderControls({ id, pipeline, status }: { id: string; pipeline: Pipeline; status: Status }) {
  const [pending, startTransition] = useTransition();
  const next = nextStatus(pipeline, status);
  const flow = PIPELINES[pipeline];

  return (
    <section className="admin-card">
      <h2 className="admin-card-h">Production status</h2>
      <div className="status-flow">
        {flow.map((s, i) => {
          const done = flow.indexOf(status) >= i;
          return (
            <span key={s} className={`flow-step${done ? " done" : ""}${s === status ? " current" : ""}`}>
              {STATUS_LABEL[s]}
            </span>
          );
        })}
      </div>
      <div className="status-controls" style={pending ? { opacity: 0.6 } : undefined}>
        {next ? (
          <button className="btn btn-teal" disabled={pending} onClick={() => startTransition(() => advanceAction(id, pipeline, status))}>
            Advance to “{STATUS_LABEL[next]}”
          </button>
        ) : (
          <span className="ord-doneflag">Order complete</span>
        )}
        <label className="status-jump">
          <span>Set status</span>
          <select
            value={status}
            disabled={pending}
            onChange={(e) => {
              const v = e.target.value as Status;
              startTransition(() => setStatusAction(id, v));
            }}
          >
            {flow.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
