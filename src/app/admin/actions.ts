"use server";

import { revalidatePath } from "next/cache";
import { setOrderStatus } from "@/lib/orders-db";
import { updateStockItem } from "@/lib/stock-db";
import { updateProduct, type ProductPatch } from "@/lib/catalog-db";
import { createStaff, setStaffPassword, setStaffActive, changeOwnPassword } from "@/lib/staff-db";
import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { nextStatus, type Pipeline, type Status } from "@/lib/admin/order-status";

export async function updateStockAction(id: string, patch: { qty?: number; low?: number }) {
  await updateStockItem(id, patch);
  revalidatePath("/admin/stock");
}

export async function updateProductAction(slug: string, patch: ProductPatch) {
  const s = await getSession();
  if (!s || !can(s.role, "products")) return { ok: false, error: "Not authorised" };
  try {
    await updateProduct(slug, patch);
  } catch (err) {
    console.error("Product update failed", err);
    return { ok: false, error: "Could not save. Please try again." };
  }
  // The storefront reads these live, so refresh the pages that show products.
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/best-sellers");
  revalidatePath(`/p/${slug}`);
  revalidatePath("/personalised");
  revalidatePath("/business");
  return { ok: true };
}

async function requireSuper() {
  const s = await getSession();
  if (!s || s.role !== "super") throw new Error("Not authorised");
  return s;
}

export async function addStaffAction(input: { name: string; email: string; password: string; isSuperAdmin: boolean }) {
  await requireSuper();
  const result = await createStaff(input);
  if (result.ok) revalidatePath("/admin/staff");
  return result;
}

export async function resetStaffPasswordAction(id: string, password: string) {
  await requireSuper();
  const result = await setStaffPassword(id, password);
  if (result.ok) revalidatePath("/admin/staff");
  return result;
}

export async function toggleStaffActiveAction(id: string, active: boolean) {
  const me = await requireSuper();
  if (me.userId === id && !active) return { ok: false, error: "You can't deactivate your own account." };
  await setStaffActive(id, active);
  revalidatePath("/admin/staff");
  return { ok: true };
}

export async function changeOwnPasswordAction(current: string, next: string) {
  const s = await getSession();
  if (!s) throw new Error("Not signed in");
  return changeOwnPassword(s.userId, current, next);
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
