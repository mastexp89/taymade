import Link from "next/link";
import { brand } from "@/lib/brand";

/** Brand mark + wordmark. `scriptColor` lets the footer use a lighter teal. */
export function Logo({ scriptColor }: { scriptColor?: string }) {
  return (
    <Link href="/" className="logo" aria-label={`${brand.name} ${brand.script} home`}>
      <svg className="mark" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="23" fill="#159AA0" />
        <path
          d="M14 16h20M24 16v18c0 0-7 0-7-6"
          stroke="#fff"
          strokeWidth={3.4}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="name">
        <b>{brand.name}</b>
        <i style={scriptColor ? { color: scriptColor } : undefined}>{brand.script}</i>
      </span>
    </Link>
  );
}
