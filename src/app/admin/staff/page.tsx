import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { listStaff } from "@/lib/staff-db";
import { StaffManager } from "@/components/admin/staff-manager";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const s = await getSession();
  if (!s || !can(s.role, "staff")) return <AdminRestricted />;
  const staff = await listStaff();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">Staff &amp; settings</h1>
          <p className="admin-sub">Add staff, reset passwords and control who can access what.</p>
        </div>
      </div>
      <StaffManager staff={staff} currentUserId={s.userId} />
      <p className="admin-note">Staff accounts can access Orders, Stock and Enquiries. Super Admins can access everything. To change your own password, use “My account” (top right).</p>
    </>
  );
}
