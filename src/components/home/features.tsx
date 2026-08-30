const features = [
  { icon: "/icons/feature/local-collection.png", title: "Free local collection", sub: "Pick up in Dundee" },
  { icon: "/icons/feature/fast-uk-delivery.png", title: "Fast UK delivery", sub: "Straight to your door" },
  { icon: "/icons/feature/premium-quality.png", title: "Premium quality", sub: "Made to last" },
  { icon: "/icons/feature/secure-checkout.png", title: "Secure checkout", sub: "Safe & encrypted" },
  { icon: "/icons/feature/friendly-support.png", title: "Friendly support", sub: "Here to help" },
];

export function Features() {
  return (
    <section className="features" aria-label="Why shop with us" style={{ padding: 0 }}>
      <div className="features-in">
        {features.map((f) => (
          <div className="feat" key={f.title}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.icon} alt="" aria-hidden="true" />
            <span>
              <b>{f.title}</b>
              <span>{f.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
