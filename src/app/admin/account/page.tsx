import { getSession } from "@/lib/auth";
import { AccountForm } from "@/components/admin/account-form";
import { ROLE_LABEL } from "@/lib/admin/roles";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const s = await getSession();
  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">My account</h1>
          <p className="admin-sub">
            Signed in as {s?.name} · {s?.email} · {s ? ROLE_LABEL[s.role] : ""}
          </p>
        </div>
      </div>
      <div className="admin-card" style={{ maxWidth: 440 }}>
        <h2 className="admin-card-h">Change your password</h2>
        <AccountForm />
      </div>
    </>
  );
}
