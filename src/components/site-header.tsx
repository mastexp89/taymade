import Link from "next/link";
import { brand, navItems } from "@/lib/brand";
import { Logo } from "@/components/logo";
import { BasketBadge } from "@/components/basket-badge";
import {
  AccountIcon,
  BasketIcon,
  Caret,
  HeartIcon,
  MapPinIcon,
  SearchIcon,
  TruckIcon,
} from "@/components/icons";

export function SiteHeader() {
  return (
    <>
      <div className="anno">
        <span>
          <MapPinIcon />
          {brand.announcement.left}
        </span>
        <span className="dot">•</span>
        <span>
          <TruckIcon />
          {brand.announcement.right}
        </span>
      </div>

      <header className="head">
        <div className="head-in">
          <Logo />
          <form className="search" role="search" action="/search">
            <input type="text" name="q" placeholder="Search for products..." aria-label="Search" />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>
          <div className="acts">
            <Link className="act" href="/account">
              <AccountIcon />
              <span>Account</span>
            </Link>
            <Link className="act" href="/wishlist">
              <HeartIcon />
              <span>Wishlist</span>
            </Link>
            <Link className="act" href="/basket">
              <BasketBadge />
              <BasketIcon />
              <span>Basket</span>
            </Link>
          </div>
        </div>
      </header>

      <nav className="main" aria-label="Product categories">
        <ul>
          {navItems.map((item) => (
            <li key={item.label} className={item.menu ? "has-menu" : undefined}>
              <Link href={item.href}>
                {item.label}
                {item.menu && <Caret className="car" />}
              </Link>
              {item.menu && (
                <div className="menu" role="menu">
                  {item.menu.map((sub) => (
                    <Link key={sub.href} href={sub.href} role="menuitem">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
