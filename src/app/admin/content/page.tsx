import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { ContentEditor } from "@/components/admin/content-editor";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const s = await getSession();
  if (!s || !can(s.role, "content")) return <AdminRestricted />;
  const content = await getSiteContent();
  return <ContentEditor content={content} />;
}
