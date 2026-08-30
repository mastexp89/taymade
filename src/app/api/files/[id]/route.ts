import { getSession } from "@/lib/auth";
import { getUploadFile } from "@/lib/uploads";

// Customer artwork — only signed-in staff can download it.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new Response("Unauthorised", { status: 401 });

  const { id } = await params;
  const file = await getUploadFile(id);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.mime,
      "Content-Disposition": `inline; filename="${file.filename.replace(/["\r\n]/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
