"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog-html";

export default function TocNav({ toc }: { toc: TocItem[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  return (
    <nav aria-label="On this page" className="min-h-0 overflow-y-auto">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-steel">On this page</p>
      <ol className="space-y-1.5">
        {toc.map((t) => (
          <li key={t.id} className={t.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${t.id}`}
              className={`block text-[13.5px] leading-snug transition-colors ${
                active === t.id ? "font-semibold text-ink" : "text-steel hover:text-ink"
              }`}
            >
              {t.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
