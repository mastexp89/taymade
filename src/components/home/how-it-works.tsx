import { Fragment } from "react";

const steps = [
  { n: 1, icon: "/icons/how/choose-your-product.png", title: "Choose your product", body: "Pick something you love from our range." },
  { n: 2, icon: "/icons/how/personalise-it.png", title: "Personalise it", body: "Add names, logos, photos or your own message." },
  { n: 3, icon: "/icons/how/approve-your-design.png", title: "Approve your design", body: "For custom orders we'll send a proof to approve." },
  { n: 4, icon: "/icons/how/we-make-it.png", title: "We make it", body: "We print, press or craft it with care in Dundee." },
  { n: 5, icon: "/icons/how/collect-or-delivery.png", title: "Collect or delivery", body: "Free local collection or delivery to your door." },
];

export function HowItWorks() {
  return (
    <section>
      <div className="wrap">
        <div className="sec-head center">
          <h2>How It Works</h2>
        </div>
        <div className="how">
          {steps.map((s, i) => (
            <Fragment key={s.n}>
              <div className="how-step">
                <div className="how-ico">
                  <span className="num">{s.n}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt="" aria-hidden="true" />
                </div>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="how-chev" aria-hidden="true">
                  ›
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
