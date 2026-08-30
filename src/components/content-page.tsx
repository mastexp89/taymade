import Link from "next/link";

export function ContentPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        {title}
      </nav>
      <header className="content-head">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </header>
      <div className="prose">{children}</div>
    </div>
  );
}
