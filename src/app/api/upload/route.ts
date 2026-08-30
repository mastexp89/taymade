import { saveUpload } from "@/lib/uploads";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const kindRaw = String(form.get("kind") ?? "ARTWORK");
    if (!(file instanceof File)) {
      return Response.json({ error: "No file received." }, { status: 400 });
    }
    const kind = kindRaw === "LOGO" ? "LOGO" : kindRaw === "PHOTO" ? "PHOTO" : "ARTWORK";
    const saved = await saveUpload(file, kind);
    return Response.json(saved);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
