"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Pickleball Basics", href: "/blog/category/pickleball-basics" },
  { label: "Rules", href: "/blog/category/rules-scoring" },
  { label: "Tips", href: "/blog/category/tips-strategy" },
  { label: "Gear & Paddles", href: "/blog/category/gear-paddles" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-hairline-dark bg-navy">
      <div className="container-site flex h-20 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-[var(--radius-md)] px-3 py-2 text-[15px] font-bold transition-colors ${
                isActive(l.href) ? "text-brand" : "text-white hover:text-brand"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-on-dark lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-hairline-dark bg-navy lg:hidden">
          <div className="container-site flex flex-col gap-1 py-4">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-[var(--radius-md)] px-3 py-2.5 text-[15px] font-bold ${
                  isActive(l.href) ? "text-brand" : "text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
