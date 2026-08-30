"use client";

import { useState, useTransition } from "react";
import { updateSiteContentAction } from "@/app/admin/actions";
import type { SiteContent } from "@/lib/site-content";

type Field = { key: keyof SiteContent; label: string; hint?: string; wide?: boolean };
type Group = { title: string; desc: string; fields: Field[] };

const GROUPS: Group[] = [
  {
    title: "Announcement bar",
    desc: "The thin strip along the very top of every page.",
    fields: [
      { key: "announceLeft", label: "Left message" },
      { key: "announceRight", label: "Right message" },
    ],
  },
  {
    title: "Homepage & footer",
    desc: "The line under the homepage headline and the blurb in the footer.",
    fields: [
      { key: "heroSub", label: "Homepage sub-heading", wide: true },
      { key: "blurb", label: "Footer blurb", wide: true },
    ],
  },
  {
    title: "Contact details",
    desc: "Shown in the footer, on the contact page and the business quote page.",
    fields: [
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "addressLine1", label: "Address line 1" },
      { key: "addressLine2", label: "Address line 2" },
      { key: "hours1", label: "Opening hours line 1", hint: "e.g. Mon–Fri: 9am–5pm" },
      { key: "hours2", label: "Opening hours line 2", hint: "e.g. Sat: 10am–2pm" },
    ],
  },
  {
    title: "Social links",
    desc: "Full URLs for the footer social icons. Leave as # to hide a link's destination.",
    fields: [
      { key: "instagram", label: "Instagram URL" },
      { key: "facebook", label: "Facebook URL" },
      { key: "tiktok", label: "TikTok URL" },
    ],
  },
];

export function ContentEditor({ content }: { content: SiteContent }) {
  const [values, setValues] = useState<SiteContent>(content);
  const [saved, setSaved] = useState<SiteContent>(content);
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const dirty = (Object.keys(values) as (keyof SiteContent)[]).some((k) => values[k] !== saved[k]);

  const set = (key: keyof SiteContent, v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (state === "done") setState("idle");
  };

  const save = () => {
    setState("saving");
    setError(null);
    startTransition(async () => {
      const res = await updateSiteContentAction(values);
      if (res?.ok) {
        setSaved(values);
        setState("done");
      } else {
        setState("error");
        setError(res?.error ?? "Could not save.");
      }
    });
  };

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">Website content</h1>
          <p className="admin-sub">Edit the storefront text below — changes go live on the site as soon as you save.</p>
        </div>
      </div>

      <div className="content-groups">
        {GROUPS.map((g) => (
          <div className="admin-card content-group" key={g.title}>
            <div className="content-group-head">
              <h2 className="admin-card-h">{g.title}</h2>
              <p className="admin-sub">{g.desc}</p>
            </div>
            <div className="content-fields">
              {g.fields.map((f) => (
                <div className={`field ${f.wide ? "wide" : ""}`} key={f.key}>
                  <label>{f.label}{f.hint && <span className="prod-cell-sub"> — {f.hint}</span>}</label>
                  {f.wide ? (
                    <textarea rows={2} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} />
                  ) : (
                    <input type="text" value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="content-savebar">
        <button type="button" className="btn btn-teal" disabled={!dirty || state === "saving"} onClick={save}>
          {state === "saving" ? "Saving…" : "Save changes"}
        </button>
        {state === "done" && !dirty && <span className="save-tag saved">Saved ✓ — live on the site</span>}
        {state === "error" && <span className="save-tag error">{error}</span>}
        {dirty && state !== "saving" && <span className="prod-cell-sub">Unsaved changes</span>}
      </div>
    </>
  );
}
