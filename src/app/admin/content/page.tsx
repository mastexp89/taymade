import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { StubPage } from "@/components/admin/stub-page";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const s = await getSession();
  if (!s || !can(s.role, "content")) return <AdminRestricted />;
  return (
    <StubPage
      title="Website content"
      desc="Edit the storefront without touching code."
      points={[
        "Edit the homepage blocks and the announcement bar",
        "Build seasonal collections (Christmas, Mother's Day…)",
        "Update delivery, collection and lead-time copy",
        "Swap hero imagery and featured products",
      ]}
    />
  );
}
