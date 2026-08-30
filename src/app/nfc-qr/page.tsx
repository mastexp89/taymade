import type { Metadata } from "next";
import { CategoryView } from "@/components/category-view";
import { categoryMeta } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: categoryMeta["nfc-qr"].title,
  description: categoryMeta["nfc-qr"].subtitle,
};

export default function NfcQrPage() {
  return <CategoryView token="nfc-qr" />;
}
