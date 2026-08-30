import { prisma } from "@/lib/prisma";
import { getProduct } from "@/lib/catalog";
import type {
  AdminOrder,
  Pipeline,
  ProofState,
  Status,
} from "@/lib/admin/order-status";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const PROOF_MAP: Record<string, ProofState> = {
  NOT_REQUIRED: "none",
  PENDING: "pending",
  SENT: "pending",
  APPROVED: "approved",
  CHANGES_REQUESTED: "changes",
};

export type NewOrderInput = {
  name: string;
  email: string;
  fulfilment: "collection" | "delivery";
  items: { slug: string; qty: number; personalisation?: { label: string; value: string; uploadId?: string }[] }[];
};

const DELIVERY_FEE = 4.95;

export async function createOrder(input: NewOrderInput): Promise<{ number: number; id: string }> {
  const clean = input.items
    .map((it) => ({ it, product: getProduct(it.slug) }))
    .filter((x) => x.product);

  const isClothing = clean.some((x) => x.product!.categories.includes("clothing"));
  const pipeline: Pipeline = isClothing ? "clothing" : "uv";

  const subtotal = clean.reduce((sum, x) => sum + x.product!.price * Math.max(1, x.it.qty), 0);
  const shipping = input.fulfilment === "delivery" ? DELIVERY_FEE : 0;

  // resolve DB product ids so the line items link back to the catalogue
  const dbProducts = await prisma.product.findMany({
    where: { slug: { in: clean.map((x) => x.product!.slug) } },
    select: { id: true, slug: true },
  });
  const idBySlug = new Map(dbProducts.map((p) => [p.slug, p.id]));

  const order = await prisma.order.create({
    data: {
      guestName: input.name,
      guestEmail: input.email,
      pipeline,
      fulfilment: input.fulfilment === "delivery" ? "DELIVERY" : "COLLECTION",
      status: "NEW",
      subtotal,
      shipping,
      total: subtotal + shipping,
      items: {
        create: clean.map((x) => {
          const p = x.product!;
          const qty = Math.max(1, Math.floor(x.it.qty) || 1);
          const hasUpload = p.fields.some((f) => f.type === "upload");
          const pid = idBySlug.get(p.slug);
          return {
            title: p.name,
            image: p.image,
            qty,
            unitPrice: p.price,
            hasUpload,
            ...(pid ? { product: { connect: { id: pid } } } : {}),
            values: {
              create: (x.it.personalisation ?? []).map((pv) => ({
                key: slug(pv.label),
                label: pv.label,
                value: pv.value,
                ...(pv.uploadId ? { upload: { connect: { id: pv.uploadId } } } : {}),
              })),
            },
          };
        }),
      },
    },
    select: { id: true, number: true },
  });

  return order;
}

type DbOrder = Awaited<ReturnType<typeof fetchOrders>>[number];

function fetchOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { values: { include: { upload: true } } } } },
  });
}

function mapOrder(o: DbOrder): AdminOrder {
  return {
    id: o.id,
    number: o.number,
    customer: o.guestName ?? "Customer",
    email: o.guestEmail ?? "",
    company: null,
    pipeline: (o.pipeline as Pipeline) ?? "uv",
    status: o.status as Status,
    fulfilment: o.fulfilment === "DELIVERY" ? "delivery" : "collection",
    proof: PROOF_MAP[o.proofStatus] ?? "none",
    total: Number(o.total),
    createdLabel: fmt.format(o.createdAt),
    items: o.items.map((it) => ({
      title: it.title,
      qty: it.qty,
      image: it.image ?? "/illustrations/biz-nfc.svg",
      hasUpload: it.hasUpload,
      personalisation: it.values.map((v) => ({
        label: v.label,
        value: v.value ?? "",
        uploadUrl: v.upload ? `/api/files/${v.upload.id}` : undefined,
        uploadName: v.upload?.filename ?? undefined,
      })),
    })),
  };
}

export async function listOrders(): Promise<AdminOrder[]> {
  const orders = await fetchOrders();
  return orders.map(mapOrder);
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  const o = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { values: { include: { upload: true } } } } },
  });
  return o ? mapOrder(o) : null;
}

export async function setOrderStatus(id: string, status: Status): Promise<void> {
  await prisma.order.update({ where: { id }, data: { status } });
}
