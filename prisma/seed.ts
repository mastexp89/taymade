/**
 * Seeds the database from the same typed catalogue the storefront uses today
 * (src/lib/catalog.ts), so switching pages over to Prisma is a drop-in.
 *
 * Run once a DATABASE_URL points at a real Postgres:
 *   npm run db:migrate   # create the schema
 *   npm run db:seed      # load categories + products
 */
import { PrismaClient, type FieldType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { products, categoryMeta } from "../src/lib/catalog";
import { STOCK_SEED } from "../src/lib/admin/stock-seed";

const prisma = new PrismaClient();

async function main() {
  // Categories from the listing metadata.
  for (const meta of Object.values(categoryMeta)) {
    const side = meta.side === "business" ? "BUSINESS" : "PERSONAL";
    await prisma.category.upsert({
      where: { slug: meta.token },
      update: { name: meta.title, side },
      create: { slug: meta.token, name: meta.title, side },
    });
  }

  // Products, their images, personalisation fields and category links.
  // NOTE: `update` is intentionally empty. Once a product row exists, its
  // price / lead time / visibility / best-seller flag are owned by
  // Admin → Products — re-seeding on redeploy must never clobber those edits.
  // Only brand-new catalogue products (no row yet) are created here.
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.name,
        shortDesc: p.shortDesc,
        description: p.description,
        basePrice: p.price,
        leadTimeDays: p.leadTimeDays,
        side: p.side === "business" ? "BUSINESS" : "PERSONAL",
        bestSeller: !!p.bestSeller,
        images: { create: [{ url: p.image, position: 0 }] },
        fields: {
          create: p.fields.map((fld, i) => ({
            key: fld.key,
            label: fld.label,
            type: fld.type.toUpperCase() as FieldType,
            required: !!fld.required,
            options: fld.options ?? undefined,
            helpText: fld.help,
            position: i,
          })),
        },
        categories: {
          connect: p.categories
            .filter((c) => categoryMeta[c])
            .map((c) => ({ slug: c })),
        },
      },
    });
  }

  // A few sample orders so the production board isn't empty on first run.
  const p = (slug: string) => products.find((x) => x.slug === slug)!;
  if ((await prisma.order.count()) === 0) {
    const b = p("personalised-water-bottle");
    await prisma.order.create({
      data: {
        guestName: "Sarah McKay", guestEmail: "sarah.mckay@example.com",
        pipeline: "uv", status: "NEW", fulfilment: "COLLECTION",
        subtotal: 19.99, total: 19.99,
        items: { create: [{ title: b.name, image: b.image, qty: 1, unitPrice: 19.99, values: { create: [
          { key: "name", label: "Name", value: "Daisy" },
          { key: "font", label: "Font", value: "Script" },
          { key: "colour", label: "Product colour", value: "Pink" },
        ] } }] },
      },
    });
    const t = p("custom-t-shirt");
    await prisma.order.create({
      data: {
        guestName: "Tom Reid", guestEmail: "tom.reid@example.com",
        pipeline: "clothing", status: "DTF_ORDERED", fulfilment: "DELIVERY", proofStatus: "APPROVED",
        subtotal: 33.98, shipping: 4.95, total: 38.93,
        items: { create: [{ title: t.name, image: t.image, qty: 2, unitPrice: 16.99, hasUpload: true, values: { create: [
          { key: "printText", label: "Text to print", value: "Reid Family 2026" },
          { key: "garmentColour", label: "Garment colour", value: "Navy" },
          { key: "size", label: "Size", value: "L" },
        ] } }] },
      },
    });
    const g = p("google-review-nfc-plaque");
    await prisma.order.create({
      data: {
        guestName: "The Corner Café", guestEmail: "hello@cornercafe.co.uk",
        pipeline: "uv", status: "ARTWORK_REQUIRED", fulfilment: "COLLECTION", proofStatus: "PENDING",
        subtotal: 24.99, total: 24.99,
        items: { create: [{ title: g.name, image: g.image, qty: 1, unitPrice: 24.99, hasUpload: true, values: { create: [
          { key: "company", label: "Company name", value: "The Corner Café" },
          { key: "reviewUrl", label: "Google review link", value: "https://g.page/r/cornercafe" },
        ] } }] },
      },
    });
    console.log("Seeded 3 sample orders.");
  }

  // Staff logins (upsert so the accounts always work in dev).
  await prisma.staffUser.upsert({
    where: { email: "admin@taymade.co.uk" },
    update: {},
    create: { email: "admin@taymade.co.uk", name: "Dylan", isSuperAdmin: true, passwordHash: await bcrypt.hash("taymade-admin", 10) },
  });
  await prisma.staffUser.upsert({
    where: { email: "rachel@taymade.co.uk" },
    update: {},
    create: { email: "rachel@taymade.co.uk", name: "Rachel", isSuperAdmin: false, passwordHash: await bcrypt.hash("taymade-rachel", 10) },
  });
  console.log("Seeded 2 staff logins.");

  // Blank stock — create-if-missing so it never wipes edited quantities.
  if ((await prisma.stockItem.count()) === 0) {
    await prisma.stockItem.createMany({ data: STOCK_SEED });
    console.log(`Seeded ${STOCK_SEED.length} stock lines.`);
  }

  // A couple of sample business enquiries.
  if ((await prisma.enquiry.count()) === 0) {
    await prisma.enquiry.createMany({
      data: [
        { company: "The Bothy Bar", contact: "Mark Devine", email: "mark@bothybar.co.uk", needs: ["NFC & QR", "Signs"], quantity: "12", status: "NEW", message: "Need review plaques and table QR codes for the new bar." },
        { company: "Tayside Plumbing", contact: "Rachel Grant", email: "info@taysideplumbing.co.uk", phone: "01382 220 145", needs: ["Workwear", "Clothing"], quantity: "20", status: "QUOTED", message: "Polos and hoodies for the team." },
      ],
    });
    console.log("Seeded 2 sample enquiries.");
  }

  console.log(`Seeded ${Object.keys(categoryMeta).length} categories and ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
