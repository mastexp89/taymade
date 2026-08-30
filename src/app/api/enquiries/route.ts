import { createEnquiry } from "@/lib/enquiries-db";

export async function POST(req: Request) {
  let body: {
    company?: string; contact?: string; email?: string; phone?: string;
    needs?: string[]; quantity?: string; requiredBy?: string; logoName?: string; logoUploadId?: string; message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const contact = body.contact?.trim();
  const email = body.email?.trim();
  if (!body.company?.trim() || !contact || !email) {
    return Response.json({ error: "Please add your company, name and email." }, { status: 400 });
  }

  try {
    await createEnquiry({
      company: body.company.trim(),
      contact,
      email,
      phone: body.phone?.trim() || undefined,
      needs: Array.isArray(body.needs) ? body.needs : [],
      quantity: body.quantity?.trim() || undefined,
      requiredBy: body.requiredBy || undefined,
      logoName: body.logoName || undefined,
      logoUploadId: body.logoUploadId || undefined,
      message: body.message?.trim() || undefined,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Enquiry create failed", err);
    return Response.json({ error: "Could not send your enquiry. Please try again." }, { status: 500 });
  }
}
