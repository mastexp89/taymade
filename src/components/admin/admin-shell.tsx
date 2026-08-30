"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import { LogoutButton } from "@/components/admin/logout-button";
import { can, ROLE_LABEL, type Perm, type Role } from "@/lib/admin/roles";

type NavItem = { label: string; href: string; perm: Perm; icon: (p: SVGProps<SVGSVGElement>) => React.ReactNode };

const I = (d: string) => (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);

const NAV: NavItem[] = [
  { label: "Orders", href: "/admin", perm: "orders", icon: I("M6 2h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM14 2v6h6M9 13h6M9 17h6") },
  { label: "Products", href: "/admin/products", perm: "products", icon: I("M3 7l9-4 9 4-9 4-9-4ZM3 7v10l9 4 9-4V7M12 11v10") },
  { label: "Stock", href: "/admin/stock", perm: "stock", icon: I("M4 7h16v13H4zM4 7l2-4h12l2 4M9 12h6") },
  { label: "Enquiries", href: "/admin/enquiries", perm: "enquiries", icon: I("M4 5h16v12H8l-4 3z") },
  { label: "Customers", href: "/admin/customers", perm: "customers", icon: I("M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8") },
  { label: "NFC & QR", href: "/admin/nfc", perm: "nfc", icon: I("M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM15 15h2v2h-2z") },
  { label: "Content", href: "/admin/content", perm: "content", icon: I("M4 5h16v14H4zM4 9h16M8 13h8M8 16h5") },
  { label: "Staff & Settings", href: "/admin/staff", perm: "staff", icon: I("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 6.7 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4 13.6H4a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 5.6 7L5.5 6.9a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.6-1.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-1.1 2.6v.1a1.6 1.6 0 0 0 1.1 1.5h.1a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1.1Z") },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/orders");
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: { name: string; role: Role };
}) {
  const pathname = usePathname() ?? "";
  const items = NAV.filter((n) => can(session.role, n.perm));

  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand">
          <span className="admin-mark">T</span>
          <span>TayMade <b>Admin</b></span>
        </Link>
        <nav className="admin-nav">
          {items.map((n) => {
            const Icon = n.icon;
            return (
              <Link key={n.href} href={n.href} className={isActive(pathname, n.href) ? "on" : undefined}>
                <Icon />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="admin-viewstore">← View store</Link>
      </aside>

      <div className="admin-main">
        <header className="admin-top">
          <div className="admin-whoami">
            Signed in as <Link href="/admin/account" className="admin-whoami-link"><b>{session.name}</b></Link> · {ROLE_LABEL[session.role]}
          </div>
          <LogoutButton />
        </header>
        <div className="admin-body">{children}</div>
      </div>
    </div>
  );
}
