import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { CustomersView } from "@/components/admin/customers-view";
import { listCustomers } from "@/lib/customers-db";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const s = await getSession();
  if (!s || !can(s.role, "customers")) return <AdminRestricted />;
  const customers = await listCustomers();
  return <CustomersView customers={customers} />;
}
