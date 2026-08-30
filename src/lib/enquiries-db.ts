import { prisma } from "@/lib/prisma";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

const STATUS_LABEL: Record<string, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  QUOTED: "Quoted",
  WON: "Won",
  LOST: "Lost",
};

export type NewEnquiry = {
  company?: string;
  contact: string;
  email: string;
  phone?: string;
  needs: string[];
  quantity?: string;
  requiredBy?: string;
  logoName?: string;
  logoUploadId?: string;
  message?: string;
};

export type EnquiryRow = {
  id: string;
  company: string | null;
  contact: string;
  email: string;
  phone: string | null;
  needs: string[];
  quantity: string | null;
  requiredBy: string | null;
  logoName: string | null;
  logoUrl: string | null;
  message: string | null;
  statusLabel: string;
  statusKey: string;
  createdLabel: string;
};

export async function createEnquiry(input: NewEnquiry) {
  return prisma.enquiry.create({
    data: {
      company: input.company,
      contact: input.contact,
      email: input.email,
      phone: input.phone,
      needs: input.needs ?? [],
      quantity: input.quantity,
      requiredBy: input.requiredBy,
      logoName: input.logoName,
      logoUploadId: input.logoUploadId,
      message: input.message,
    },
  });
}

export async function listEnquiries(): Promise<EnquiryRow[]> {
  const rows = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((e) => ({
    id: e.id,
    company: e.company,
    contact: e.contact,
    email: e.email,
    phone: e.phone,
    needs: e.needs,
    quantity: e.quantity,
    requiredBy: e.requiredBy,
    logoName: e.logoName,
    logoUrl: e.logoUploadId ? `/api/files/${e.logoUploadId}` : null,
    message: e.message,
    statusLabel: STATUS_LABEL[e.status] ?? e.status,
    statusKey: e.status,
    createdLabel: fmt.format(e.createdAt),
  }));
}
