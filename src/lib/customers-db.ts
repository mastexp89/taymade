/**
 * Customers view — derived, not a separate table.
 *
 * There are no customer logins yet, so a "customer" is simply everyone who has
 * placed an order (grouped by email), enriched with any business details they
 * gave through a quote enquiry. This gives Rachel a real who-orders-from-us
 * list built from the data we already capture.
 */
import { prisma } from "@/lib/prisma";
import { STATUS_LABEL, groupOf, type Status } from "@/lib/admin/order-status";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export type CustomerOrder = {
  id: string;
  number: number;
  dateLabel: string;
  total: number;
  statusLabel: string;
  statusKey: Status;
  isOpen: boolean;
};

export type CustomerRow = {
  email: string;
  name: string;
  company: string | null;
  isBusiness: boolean;
  orderCount: number;
  totalSpent: number;
  openOrders: number;
  firstOrderLabel: string;
  lastOrderLabel: string;
  orders: CustomerOrder[];
};

export async function listCustomers(): Promise<CustomerRow[]> {
  const [orders, enquiries] = await Promise.all([
    prisma.order.findMany({
      where: { guestEmail: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { id: true, number: true, guestName: true, guestEmail: true, total: true, status: true, createdAt: true },
    }),
    prisma.enquiry.findMany({
      select: { email: true, company: true, contact: true },
    }),
  ]);

  // Business info keyed by email — a matching enquiry marks a business customer.
  const business = new Map<string, { company: string | null; contact: string | null }>();
  for (const e of enquiries) {
    const key = e.email.toLowerCase().trim();
    if (!business.has(key)) business.set(key, { company: e.company ?? null, contact: e.contact ?? null });
  }

  const byEmail = new Map<string, CustomerRow>();
  for (const o of orders) {
    const email = (o.guestEmail ?? "").toLowerCase().trim();
    if (!email) continue;
    const status = o.status as Status;
    const isOpen = groupOf(status) !== "completed";
    const total = Number(o.total);

    let row = byEmail.get(email);
    if (!row) {
      const biz = business.get(email);
      row = {
        email,
        name: o.guestName ?? biz?.contact ?? "Customer",
        company: biz?.company ?? null,
        isBusiness: !!biz,
        orderCount: 0,
        totalSpent: 0,
        openOrders: 0,
        firstOrderLabel: "",
        lastOrderLabel: "",
        orders: [],
      };
      byEmail.set(email, row);
    }

    row.orders.push({
      id: o.id,
      number: o.number,
      dateLabel: dateFmt.format(o.createdAt),
      total,
      statusLabel: STATUS_LABEL[status] ?? status,
      statusKey: status,
      isOpen,
    });
    row.orderCount += 1;
    row.totalSpent += total;
    if (isOpen) row.openOrders += 1;
  }

  // Orders came in newest-first, so first pushed = latest, last pushed = earliest.
  const rows = [...byEmail.values()].map((r) => ({
    ...r,
    lastOrderLabel: r.orders[0]?.dateLabel ?? "",
    firstOrderLabel: r.orders[r.orders.length - 1]?.dateLabel ?? "",
  }));

  // Best customers first (most spent), then by order count.
  rows.sort((a, b) => b.totalSpent - a.totalSpent || b.orderCount - a.orderCount);
  return rows;
}
