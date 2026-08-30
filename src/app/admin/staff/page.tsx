import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { StubPage } from "@/components/admin/stub-page";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const s = await getSession();
  if (!s || !can(s.role, "staff")) return <AdminRestricted />;
  return (
    <StubPage
      title="Staff & settings"
      desc="You're the Super Admin — add staff and control exactly what they see."
      points={[
        "Add staff accounts with their own login (Rachel is set up already)",
        "Toggle each area on/off per person — permissions are data, not code",
        "Reset passwords and manage store settings",
        "Staff currently see Orders, Stock and Enquiries only",
      ]}
    />
  );
}
