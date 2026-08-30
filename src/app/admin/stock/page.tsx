import { getStock, STOCK_CATEGORIES } from "@/lib/stock-db";
import { StockEditor } from "@/components/admin/stock-editor";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const items = await getStock();
  return <StockEditor items={items} categories={[...STOCK_CATEGORIES]} />;
}
