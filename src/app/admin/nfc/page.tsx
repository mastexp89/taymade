import { getSession } from "@/lib/auth";
import { can } from "@/lib/admin/roles";
import { AdminRestricted } from "@/components/admin/admin-restricted";
import { StubPage } from "@/components/admin/stub-page";

export const dynamic = "force-dynamic";

export default async function AdminNfcPage() {
  const s = await getSession();
  if (!s || !can(s.role, "nfc")) return <AdminRestricted />;
  return (
    <StubPage
      title="NFC & QR"
      desc="The recurring-value system — dynamic tap/scan destinations."
      points={[
        "Manage every NFC/QR code and what it points at",
        "Change a destination without reprinting the plaque",
        "See tap & scan analytics per customer",
        "Groundwork for a paid QR/NFC management subscription",
      ]}
    />
  );
}
