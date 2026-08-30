import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders-db";
import { StatusPill } from "@/components/admin/status-pill";
import { OrderControls } from "@/components/admin/order-controls";

export const dynamic = "force-dynamic";

const PROOF_LABEL: Record<string, string> = {
  none: "Not required",
  pending: "Awaiting customer approval",
  approved: "Approved",
  changes: "Changes requested",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <>
      <Link href="/admin" className="admin-link">← Production board</Link>

      <div className="admin-head" style={{ marginTop: 10 }}>
        <div>
          <h1 className="admin-h1">Order #{order.number}</h1>
          <p className="admin-sub">{order.createdLabel} · {order.company ?? order.customer}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="order-detail">
        <div className="order-detail-main">
          <OrderControls id={order.id} pipeline={order.pipeline} status={order.status} />

          {order.items.map((item, idx) => (
            <section className="admin-card" key={idx}>
              <div className="prod-item">
                <div className="prod-item-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="prod-item-body">
                  <h2 className="admin-card-h">{item.qty}× {item.title}</h2>
                  <dl className="perso-list">
                    {item.personalisation.map((p, i) => (
                      <div key={i} style={{ display: "contents" }}>
                        <dt>{p.label}</dt>
                        <dd>
                          {/^#[0-9a-f]{3,8}$/i.test(p.value) ? (
                            <><span className="swatch-dot" style={{ background: p.value }} /> {p.value}</>
                          ) : p.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="prod-files">
                    <button className="file-btn" type="button" title="Demo — real print files come with the uploads step">⬇ Download print file</button>
                    {item.hasUpload && <button className="file-btn" type="button">⬇ Customer artwork</button>}
                  </div>
                </div>
              </div>
            </section>
          ))}

          <section className="admin-card">
            <h2 className="admin-card-h">Design proof</h2>
            <p className="proof-state">Status: <b>{PROOF_LABEL[order.proof]}</b></p>
            <button className="file-btn" type="button" title="Demo — proof upload comes with the artwork step">⬆ Upload a proof</button>
          </section>
        </div>

        <aside className="order-detail-side">
          <section className="admin-card">
            <h2 className="admin-card-h">Customer</h2>
            <p className="side-line"><b>{order.customer}</b></p>
            {order.company && <p className="side-line">{order.company}</p>}
            {order.email && <p className="side-line"><a className="admin-link" href={`mailto:${order.email}`}>{order.email}</a></p>}
          </section>
          <section className="admin-card">
            <h2 className="admin-card-h">Fulfilment</h2>
            <p className="side-line">{order.fulfilment === "collection" ? "📍 Free local collection (Dundee)" : "🚐 UK delivery"}</p>
            <p className="side-line admin-sub">
              {order.fulfilment === "collection" ? "Notify the customer when it's ready to collect." : "Post once complete and mark dispatched."}
            </p>
          </section>
          <section className="admin-card">
            <h2 className="admin-card-h">Summary</h2>
            <div className="side-sum"><span>Pipeline</span><span>{order.pipeline === "uv" ? "UV / Print" : "Clothing"}</span></div>
            <div className="side-sum"><span>Items</span><span>{order.items.reduce((n, i) => n + i.qty, 0)}</span></div>
            <div className="side-sum total"><span>Order total</span><span>£{order.total.toFixed(2)}</span></div>
          </section>
        </aside>
      </div>
    </>
  );
}
