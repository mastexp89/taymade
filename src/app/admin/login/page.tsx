import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-brand">
          <span className="admin-mark">T</span>
          <span>TayMade <b>Admin</b></span>
        </div>
        <h1>Sign in</h1>
        <p>Staff access to the production dashboard.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
