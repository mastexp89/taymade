import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { StubPage } from "@/components/admin/stub-page";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const s = await getSession();
  if (!s || !can(s.role, "products")) return <AdminRestricted />;
  return (
    <StubPage
      title="Products"
      desc="Your catalogue — everything is editable, nothing is hard-coded."
      points={[
        "Add & edit products, prices and lead times",
        "Manage categories, collections and best sellers",
        "Set up personalisation options — fields, fonts and colours",
        "Build bundle packs and edit their contents & price",
      ]}
    />
  );
}
