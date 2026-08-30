import { listOrders } from "@/lib/orders-db";
import { OrdersBoard } from "@/components/admin/orders-board";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  return <OrdersBoard orders={orders} />;
}
