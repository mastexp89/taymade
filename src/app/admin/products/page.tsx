import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { ProductManager } from "@/components/admin/product-manager";
import { listAdminProducts } from "@/lib/catalog-db";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const s = await getSession();
  if (!s || !can(s.role, "products")) return <AdminRestricted />;
  const items = await listAdminProducts();
  return <ProductManager items={items} />;
}
