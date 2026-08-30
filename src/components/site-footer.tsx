import Link from "next/link";
import { brand, navItems } from "@/lib/brand";
import { Logo } from "@/components/logo";

const shopLinks = navItems;
const serviceLinks = [
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Delivery Information", href: "/delivery-collection" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap foot">
        <div>
          <Logo scriptColor="#3BB8AF" />
          <p className="blurb">{brand.blurb}</p>
          <div className="socials">
            <a href={brand.social.instagram} aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2.7 0 3 0 4.1.1 1 0 1.7.2 2.3.5.6.2 1.1.5 1.6 1s.8 1 1 1.6c.3.6.5 1.3.5 2.3.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.7-.5 2.3-.2.6-.5 1.1-1 1.6s-1 .8-1.6 1c-.6.3-1.3.5-2.3.5-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.7-.2-2.3-.5-.6-.2-1.1-.5-1.6-1s-.8-1-1-1.6c-.3-.6-.5-1.3-.5-2.3C2 15 2 14.7 2 12s0-3 .1-4.1c0-1 .2-1.7.5-2.3.2-.6.5-1.1 1-1.6s1-.8 1.6-1c.6-.3 1.3-.5 2.3-.5C8.6 2 9 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.4 7.6a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" /></svg>
            </a>
            <a href={brand.social.facebook} aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z" /></svg>
            </a>
            <a href={brand.social.tiktok} aria-label="TikTok">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3c.3 2.3 1.7 3.9 4 4.2v3c-1.5 0-2.9-.5-4-1.3v6.6a6 6 0 11-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 101 2.3V3h4z" /></svg>
            </a>
            <a href={brand.social.email} aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3zM3 6l9 7 9-7" fill="none" stroke="#fff" strokeWidth={1.6} /></svg>
            </a>
          </div>
        </div>

        <div>
          <h4>Shop</h4>
          {shopLinks.map((l) => (
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
        </div>

        <div>
          <h4>Customer Service</h4>
          {serviceLinks.map((l) => (
            <Link key={l.label} href={l.href}>{l.label}</Link>
          ))}
        </div>

        <div>
          <h4>Contact</h4>
          <div className="contact-row">
            <svg viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>
            <span>{brand.contact.address[0]}<br />{brand.contact.address[1]}</span>
          </div>
          <div className="contact-row">
            <svg viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true"><path d="M5 4h4l2 5-3 2c1 2 3 4 5 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>
            <span>{brand.contact.phone}</span>
          </div>
          <div className="contact-row">
            <svg viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true"><path d="M3 5h18v14H3zM3 6l9 7 9-7" /></svg>
            <span>{brand.contact.email}</span>
          </div>
          <div className="contact-row">
            <svg viewBox="0 0 24 24" strokeWidth={1.8} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            <span>{brand.contact.hours[0]}<br />{brand.contact.hours[1]}</span>
          </div>
        </div>

        <div className="news">
          <h4>Newsletter</h4>
          <p style={{ fontSize: 13, margin: "0 0 12px" }}>
            Be the first to know about new products, offers and more.
          </p>
          <form action="/newsletter" method="post">
            <input type="email" name="email" placeholder="Enter your email" aria-label="Email address" />
            <button className="btn btn-teal" type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="wrap foot-bottom">
        <span>© 2026 {brand.name} {brand.script}. All rights reserved.</span>
        <span className="credit">
          Designed by{" "}
          <a href="https://forthhost.com" target="_blank" rel="noopener noreferrer">
            Forth Host &amp; Web Design
          </a>
        </span>
        <span>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms &amp; Conditions</Link>
        </span>
      </div>
    </footer>
  );
}
