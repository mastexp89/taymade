import type { Metadata } from "next";
import { CategoryView } from "@/components/category-view";
import { categoryMeta } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: categoryMeta["uv-dtf"].title,
  description: categoryMeta["uv-dtf"].subtitle,
};

export default function UvDtfPage() {
  return <CategoryView token="uv-dtf" />;
}
