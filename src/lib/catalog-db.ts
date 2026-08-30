/**
 * Storefront + admin catalogue overlay.
 *
 * The rich, structural catalogue (images, personalisation fields, categories,
 * bundle contents) lives in src/lib/catalog.ts. The operational, editable bits
 * — price, lead time, name, descriptions, best-seller flag and whether a
 * product is shown at all — live in the Postgres `Product` table and are
 * managed from Admin → Products.
 *
 * These helpers merge the two: catalogue base + DB overrides (DB wins), so an
 * edit in the admin takes effect on the storefront immediately. Inactive
 * products are hidden from every storefront listing and 404 on their page.
 */
import { prisma } from "@/lib/prisma";
import {
  products as baseProducts,
  getProduct as baseGetProduct,
  getProductsByCategory as baseByCategory,
  type Product,
} from "@/lib/catalog";

export type ProductOverride = {
  price: number;
  leadTimeDays: number;
  name: string;
  shortDesc: string;
  description: string | null;
  bestSeller: boolean;
  active: boolean;
};

async function loadOverrides(): Promise<Map<string, ProductOverride>> {
  const rows = await prisma.product.findMany({
    select: {
      slug: true,
      basePrice: true,
      leadTimeDays: true,
      title: true,
      shortDesc: true,
      description: true,
      bestSeller: true,
      active: true,
    },
  });
  return new Map(
    rows.map((r) => [
      r.slug,
      {
        price: Number(r.basePrice),
        leadTimeDays: r.leadTimeDays,
        name: r.title,
        shortDesc: r.shortDesc ?? "",
        description: r.description,
        bestSeller: r.bestSeller,
        active: r.active,
      },
    ]),
  );
}

function apply(base: Product, o: ProductOverride | undefined): Product {
  if (!o) return base;
  return {
    ...base,
    price: o.price,
    leadTimeDays: o.leadTimeDays,
    name: o.name || base.name,
    shortDesc: o.shortDesc || base.shortDesc,
    description: o.description ?? base.description,
    bestSeller: o.bestSeller,
  };
}

/** A single product with overrides applied. Undefined if missing or hidden. */
export async function getProduct(slug: string): Promise<Product | undefined> {
  const base = baseGetProduct(slug);
  if (!base) return undefined;
  const o = (await loadOverrides()).get(slug);
  if (o && !o.active) return undefined;
  return apply(base, o);
}

/** Active products in a category token, overrides applied. */
export async function getProductsByCategory(token: string): Promise<Product[]> {
  const o = await loadOverrides();
  return baseByCategory(token)
    .filter((p) => o.get(p.slug)?.active !== false)
    .map((p) => apply(p, o.get(p.slug)));
}

/** Every active product, overrides applied (used by search). */
export async function listActiveProducts(): Promise<Product[]> {
  const o = await loadOverrides();
  return baseProducts
    .filter((p) => o.get(p.slug)?.active !== false)
    .map((p) => apply(p, o.get(p.slug)));
}

/** Active best-sellers, driven by the DB flag. */
export async function getBestSellers(): Promise<Product[]> {
  const o = await loadOverrides();
  return baseProducts
    .filter((p) => {
      const ov = o.get(p.slug);
      if (ov) return ov.active && ov.bestSeller;
      return !!p.bestSeller;
    })
    .map((p) => apply(p, o.get(p.slug)));
}

// ---------- admin ----------
export type AdminProduct = {
  slug: string;
  name: string;
  image: string;
  side: "personal" | "business";
  category: string;
  price: number;
  leadTimeDays: number;
  shortDesc: string;
  description: string;
  bestSeller: boolean;
  active: boolean;
};

/** Every product (including hidden), base + overrides, for the admin table. */
export async function listAdminProducts(): Promise<AdminProduct[]> {
  const o = await loadOverrides();
  return baseProducts.map((p) => {
    const ov = o.get(p.slug);
    return {
      slug: p.slug,
      name: ov?.name || p.name,
      image: p.image,
      side: p.side,
      category: p.categories[0] ?? "",
      price: ov?.price ?? p.price,
      leadTimeDays: ov?.leadTimeDays ?? p.leadTimeDays,
      shortDesc: ov?.shortDesc ?? p.shortDesc,
      description: (ov?.description ?? p.description) ?? "",
      bestSeller: ov?.bestSeller ?? !!p.bestSeller,
      active: ov?.active ?? true,
    };
  });
}

export type ProductPatch = {
  name?: string;
  price?: number;
  leadTimeDays?: number;
  shortDesc?: string;
  description?: string;
  bestSeller?: boolean;
  active?: boolean;
};

/** Persist an admin edit. Upserts so a catalogue product with no row is handled. */
export async function updateProduct(slug: string, patch: ProductPatch): Promise<void> {
  const base = baseGetProduct(slug);
  if (!base) throw new Error(`Unknown product: ${slug}`);

  const data = {
    ...(patch.name !== undefined ? { title: patch.name } : {}),
    ...(patch.price !== undefined ? { basePrice: patch.price } : {}),
    ...(patch.leadTimeDays !== undefined ? { leadTimeDays: patch.leadTimeDays } : {}),
    ...(patch.shortDesc !== undefined ? { shortDesc: patch.shortDesc } : {}),
    ...(patch.description !== undefined ? { description: patch.description } : {}),
    ...(patch.bestSeller !== undefined ? { bestSeller: patch.bestSeller } : {}),
    ...(patch.active !== undefined ? { active: patch.active } : {}),
  };

  await prisma.product.upsert({
    where: { slug },
    update: data,
    create: {
      slug,
      title: patch.name ?? base.name,
      shortDesc: patch.shortDesc ?? base.shortDesc,
      description: patch.description ?? base.description,
      basePrice: patch.price ?? base.price,
      leadTimeDays: patch.leadTimeDays ?? base.leadTimeDays,
      side: base.side === "business" ? "BUSINESS" : "PERSONAL",
      bestSeller: patch.bestSeller ?? !!base.bestSeller,
      active: patch.active ?? true,
    },
  });
}
