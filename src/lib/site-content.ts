/**
 * Editable storefront content (Admin → Content).
 *
 * The `brand` config (src/lib/brand.ts) supplies the defaults; anything the
 * shop owner changes is stored as a JSON payload in the ContentBlock row
 * key="site" and merged over those defaults. So the announcement bar, contact
 * details, hero line and social links can be changed without touching code.
 */
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { brand } from "@/lib/brand";

export type SiteContent = {
  announceLeft: string;
  announceRight: string;
  heroSub: string;
  blurb: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  hours1: string;
  hours2: string;
  instagram: string;
  facebook: string;
  tiktok: string;
};

export const CONTENT_DEFAULTS: SiteContent = {
  announceLeft: brand.announcement.left,
  announceRight: brand.announcement.right,
  heroSub: brand.heroSub,
  blurb: brand.blurb,
  phone: brand.contact.phone,
  email: brand.contact.email,
  addressLine1: brand.contact.address[0] ?? "",
  addressLine2: brand.contact.address[1] ?? "",
  hours1: brand.contact.hours[0] ?? "",
  hours2: brand.contact.hours[1] ?? "",
  instagram: brand.social.instagram,
  facebook: brand.social.facebook,
  tiktok: brand.social.tiktok,
};

const CONTENT_KEY = "site";

// Deduped per request so the layout + page share one query.
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const row = await prisma.contentBlock.findUnique({ where: { key: CONTENT_KEY } });
  const saved = (row?.payload ?? {}) as Partial<Record<keyof SiteContent, unknown>>;
  const out = { ...CONTENT_DEFAULTS };
  for (const k of Object.keys(out) as (keyof SiteContent)[]) {
    const v = saved[k];
    if (typeof v === "string") out[k] = v;
  }
  return out;
});

export async function updateSiteContent(patch: Partial<SiteContent>): Promise<void> {
  const current = await getSiteContent();
  const merged: SiteContent = { ...current };
  for (const k of Object.keys(patch) as (keyof SiteContent)[]) {
    const v = patch[k];
    if (typeof v === "string") merged[k] = v;
  }
  await prisma.contentBlock.upsert({
    where: { key: CONTENT_KEY },
    update: { payload: merged },
    create: { key: CONTENT_KEY, payload: merged },
  });
}
