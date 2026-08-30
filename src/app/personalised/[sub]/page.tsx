import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/category-view";
import { categoryMeta } from "@/lib/catalog";

const SUBS = ["clothing", "bottles-tumblers", "weddings", "sports-clubs"] as const;

// Product prices/visibility come from the DB (Admin → Products), so render live.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sub: string }>;
}): Promise<Metadata> {
  const { sub } = await params;
  const meta = categoryMeta[sub];
  return meta ? { title: meta.title, description: meta.subtitle } : {};
}

export default async function PersonalisedSubPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub } = await params;
  if (!(SUBS as readonly string[]).includes(sub)) notFound();
  return (
    <CategoryView
      token={sub}
      crumbs={[{ label: "Personalised", href: "/personalised" }]}
    />
  );
}
