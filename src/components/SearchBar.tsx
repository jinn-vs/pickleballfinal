"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Lightweight search box. For now it routes to /blog?q=… (the blog list can
 * read the query later); wire a full search index when content grows.
 */
export default function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/blog?q=${encodeURIComponent(q.trim())}` : "/blog");
      }}
      className={`relative ${className}`}
      role="search"
    >
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m15 15 3 3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search articles…"
        aria-label="Search articles"
        className="h-10 w-full rounded-[var(--radius-full)] border border-hairline-dark bg-navy-mid pl-9 pr-4 text-sm text-on-dark placeholder:text-on-dark-muted outline-none focus:border-brand"
      />
    </form>
  );
}
