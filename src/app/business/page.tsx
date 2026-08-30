import type { Metadata } from "next";
import { CategoryView } from "@/components/category-view";
import { categoryMeta } from "@/lib/catalog";

export const metadata: Metadata = {
  title: categoryMeta.business.title,
  description: categoryMeta.business.subtitle,
};

export default function BusinessPage() {
  return <CategoryView token="business" showQuote />;
}
