import Link from "next/link";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[13px] text-steel">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {last || !it.href ? (
              <span className={last ? "max-w-[260px] truncate text-slate" : ""}>{it.label}</span>
            ) : (
              <Link href={it.href} className="transition-colors hover:text-ink">
                {it.label}
              </Link>
            )}
            {!last && <span aria-hidden className="text-muted-soft">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
