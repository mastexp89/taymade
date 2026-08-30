"use server";

import { revalidatePath } from "next/cache";
import { setOrderStatus } from "@/lib/orders-db";
import { updateStockItem } from "@/lib/stock-db";
import { nextStatus, type Pipeline, type Status } from "@/lib/admin/order-status";

export async function updateStockAction(id: string, patch: { qty?: number; low?: number }) {
  await updateStockItem(id, patch);
  revalidatePath("/admin/stock");
}

export async function setStatusAction(id: string, status: Status) {
  await setOrderStatus(id, status);
  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${id}`);
}

export async function advanceAction(id: string, pipeline: Pipeline, current: Status) {
  const next = nextStatus(pipeline, current);
  if (!next) return;
  await setOrderStatus(id, next);
  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${id}`);
}
