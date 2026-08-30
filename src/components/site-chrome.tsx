"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { SiteContent } from "@/lib/site-content";

/**
 * Wraps storefront pages in the header/footer, but leaves /admin bare so the
 * back office can render its own shell.
 */
export function SiteChrome({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <SiteHeader content={content} />
      <main>{children}</main>
      <SiteFooter content={content} />
    </>
  );
}
