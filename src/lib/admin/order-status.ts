// Shared order-status constants + types (server-safe — no "use client").

export type Pipeline = "uv" | "clothing";

export type Status =
  | "NEW"
  | "ARTWORK_REQUIRED"
  | "ARTWORK_READY"
  | "READY_TO_PRINT"
  | "PRINTING"
  | "DTF_ORDERED"
  | "DTF_RECEIVED"
  | "READY_TO_PRESS"
  | "PRESSED"
  | "QUALITY_CHECK"
  | "READY_FOR_COLLECTION"
  | "DISPATCHED"
  | "COMPLETED"
  | "CANCELLED";

export type ProofState = "none" | "pending" | "approved" | "changes";

export const PIPELINES: Record<Pipeline, Status[]> = {
  uv: ["NEW", "ARTWORK_REQUIRED", "READY_TO_PRINT", "PRINTING", "QUALITY_CHECK", "READY_FOR_COLLECTION", "DISPATCHED", "COMPLETED"],
  clothing: ["NEW", "ARTWORK_READY", "DTF_ORDERED", "DTF_RECEIVED", "READY_TO_PRESS", "PRESSED", "READY_FOR_COLLECTION", "DISPATCHED", "COMPLETED"],
};

export const STATUS_LABEL: Record<Status, string> = {
  NEW: "New",
  ARTWORK_REQUIRED: "Artwork required",
  ARTWORK_READY: "Artwork ready",
  READY_TO_PRINT: "Ready to print",
  PRINTING: "Printing",
  DTF_ORDERED: "DTF ordered",
  DTF_RECEIVED: "DTF received",
  READY_TO_PRESS: "Ready to press",
  PRESSED: "Pressed",
  QUALITY_CHECK: "Quality check",
  READY_FOR_COLLECTION: "Ready for collection",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export type GroupKey = "new" | "artwork" | "production" | "ready" | "dispatched" | "completed";

export const GROUP_LABEL: Record<GroupKey, string> = {
  new: "New",
  artwork: "Needs artwork",
  production: "In production",
  ready: "Ready to collect",
  dispatched: "Dispatched",
  completed: "Completed",
};

export const GROUP_ORDER: GroupKey[] = ["new", "artwork", "production", "ready", "dispatched", "completed"];

const STATUS_GROUP: Record<Status, GroupKey> = {
  NEW: "new",
  ARTWORK_REQUIRED: "artwork",
  ARTWORK_READY: "artwork",
  READY_TO_PRINT: "production",
  PRINTING: "production",
  DTF_ORDERED: "production",
  DTF_RECEIVED: "production",
  READY_TO_PRESS: "production",
  PRESSED: "production",
  QUALITY_CHECK: "production",
  READY_FOR_COLLECTION: "ready",
  DISPATCHED: "dispatched",
  COMPLETED: "completed",
  CANCELLED: "completed",
};

export const groupOf = (s: Status): GroupKey => STATUS_GROUP[s];

export function nextStatus(pipeline: Pipeline, status: Status): Status | null {
  const flow = PIPELINES[pipeline];
  const i = flow.indexOf(status);
  return i >= 0 && i < flow.length - 1 ? flow[i + 1] : null;
}

// UI-facing shape used by the board + detail (mapped from the DB).
export type AdminOrderItem = {
  title: string;
  qty: number;
  image: string;
  personalisation: { label: string; value: string; uploadUrl?: string; uploadName?: string }[];
  hasUpload?: boolean;
};

export type AdminOrder = {
  id: string;
  number: number;
  customer: string;
  email: string;
  company?: string | null;
  pipeline: Pipeline;
  status: Status;
  fulfilment: "collection" | "delivery";
  proof: ProofState;
  total: number;
  createdLabel: string;
  items: AdminOrderItem[];
};
