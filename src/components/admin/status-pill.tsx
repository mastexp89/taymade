import { STATUS_LABEL, groupOf, type Status } from "@/lib/admin/order-status";

const GROUP_CLASS: Record<string, string> = {
  new: "s-new",
  artwork: "s-artwork",
  production: "s-prod",
  ready: "s-ready",
  dispatched: "s-disp",
  completed: "s-done",
};

export function StatusPill({ status }: { status: Status }) {
  return <span className={`status-pill ${GROUP_CLASS[groupOf(status)]}`}>{STATUS_LABEL[status]}</span>;
}
