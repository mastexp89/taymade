"use client";

import { useState } from "react";

export function UploadField({
  kind = "ARTWORK",
  onUploaded,
}: {
  kind?: "ARTWORK" | "LOGO" | "PHOTO";
  onUploaded: (u: { id: string; name: string } | null) => void;
}) {
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File | undefined) {
    if (!file) {
      setState("idle"); setName(""); onUploaded(null); return;
    }
    setState("uploading"); setName(file.name); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.id) { setState("done"); onUploaded({ id: data.id, name: data.filename }); }
      else { setState("error"); setError(data.error ?? "Upload failed."); onUploaded(null); }
    } catch {
      setState("error"); setError("Upload failed. Please try again."); onUploaded(null);
    }
  }

  return (
    <label className="uploadbox">
      {state === "uploading" && <>Uploading {name}…</>}
      {state === "done" && <span className="picked">✓ {name}</span>}
      {state === "error" && <span style={{ color: "var(--coral)", fontWeight: 600 }}>{error}</span>}
      {state === "idle" && "Click to upload a file (PNG, JPG, PDF, SVG — max 10 MB)"}
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.pdf,.svg"
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </label>
  );
}
