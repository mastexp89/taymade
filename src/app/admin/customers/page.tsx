import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { StubPage } from "@/components/admin/stub-page";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const s = await getSession();
  if (!s || !can(s.role, "customers")) return <AdminRestricted />;
  return (
    <StubPage
      title="Customers"
      desc="People and businesses who order from you."
      points={[
        "View customers and their full order history",
        "Saved business branding — logo, colours, company details",
        "Enable 1-click repeat ordering for regulars",
        "Export customer lists for marketing",
      ]}
    />
  );
}
