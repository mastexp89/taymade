import { listEnquiries } from "@/lib/enquiries-db";

export const dynamic = "force-dynamic";

const STATUS_CLASS: Record<string, string> = {
  NEW: "s-new",
  IN_PROGRESS: "s-prod",
  QUOTED: "s-artwork",
  WON: "s-ready",
  LOST: "s-done",
};

export default async function EnquiriesPage() {
  const enquiries = await listEnquiries();
  const newCount = enquiries.filter((e) => e.statusKey === "NEW").length;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-h1">Business enquiries</h1>
          <p className="admin-sub">{newCount} new quote request{newCount === 1 ? "" : "s"}</p>
        </div>
      </div>
      {enquiries.length === 0 ? (
        <p className="admin-empty">No enquiries yet. They&apos;ll appear here from the Business quote form.</p>
      ) : (
        <div className="enq-list">
          {enquiries.map((e) => (
            <div className="admin-card enq-card" key={e.id}>
              <div>
                <div className="enq-top">
                  <h2 className="admin-card-h" style={{ margin: 0 }}>{e.company ?? e.contact}</h2>
                  <span className={`status-pill ${STATUS_CLASS[e.statusKey] ?? "s-new"}`}>{e.statusLabel}</span>
                </div>
                <p className="enq-needs">
                  {e.needs.length ? e.needs.join(", ") : "General enquiry"}
                  {e.quantity ? <> · <b>~{e.quantity}</b></> : null}
                </p>
                <p className="admin-sub">
                  {e.contact} · <a className="admin-link" href={`mailto:${e.email}`}>{e.email}</a>
                  {e.phone ? ` · ${e.phone}` : ""}
                </p>
                {e.message && <p className="enq-msg">“{e.message}”</p>}
                {(e.requiredBy || e.logoName) && (
                  <p className="admin-sub">
                    {e.requiredBy ? `Needed by ${e.requiredBy}` : ""}
                    {e.requiredBy && e.logoName ? " · " : ""}
                    {e.logoName ? (
                      e.logoUrl ? (
                        <>Logo: <a href={e.logoUrl} download target="_blank" rel="noreferrer" className="file-link">{e.logoName}</a></>
                      ) : (
                        `Logo: ${e.logoName}`
                      )
                    ) : ""}
                  </p>
                )}
              </div>
              <div className="enq-right">
                <span className="ord-date">{e.createdLabel}</span>
                <a className="btn btn-teal" href={`mailto:${e.email}`}>Reply</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
