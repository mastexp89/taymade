import { prisma } from "@/lib/prisma";
import { STOCK_CATEGORIES } from "@/lib/admin/stock-seed";

export { STOCK_CATEGORIES };

export type StockItem = {
  id: string;
  name: string;
  variant: string;
  category: string;
  qty: number;
  low: number;
};

export async function getStock(): Promise<StockItem[]> {
  const rows = await prisma.stockItem.findMany({ orderBy: { position: "asc" } });
  return rows.map((r) => ({ id: r.id, name: r.name, variant: r.variant, category: r.category, qty: r.qty, low: r.low }));
}

export async function updateStockItem(id: string, patch: { qty?: number; low?: number }) {
  await prisma.stockItem.update({ where: { id }, data: patch });
}
