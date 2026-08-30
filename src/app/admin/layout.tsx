import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // No session → the login page renders bare (middleware sends everything else here).
  if (!session) return <>{children}</>;
  return <AdminShell session={session}>{children}</AdminShell>;
}
