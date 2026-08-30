import type { Metadata } from "next";
import { CategoryView } from "@/components/category-view";
import { categoryMeta } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: categoryMeta.personalised.title,
  description: categoryMeta.personalised.subtitle,
};

export default function PersonalisedPage() {
  return <CategoryView token="personalised" />;
}
