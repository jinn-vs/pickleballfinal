import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

const CATEGORIES = [
  { label: "Pickleball Basics", href: "/blog/category/pickleball-basics" },
  { label: "Rules & Scoring", href: "/blog/category/rules-scoring" },
  { label: "Tips & Strategy", href: "/blog/category/tips-strategy" },
  { label: "Gear & Paddles", href: "/blog/category/gear-paddles" },
];

const COMPANY = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-navy text-on-dark">
      <div className="container-site py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Image src="/logo.webp" alt={`${SITE_NAME} logo`} width={200} height={61} className="h-10 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-on-dark-muted">
              Pickleball news, rules, drills, gear reviews and strategy, everything you need to
              learn the game and level up your play.
            </p>
            <Link href="/blog/rss.xml" className="mt-4 inline-block text-sm font-semibold text-brand">
              RSS feed →
            </Link>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-on-dark">Explore</h4>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-on-dark-muted transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-on-dark">Company</h4>
            <ul className="mt-4 space-y-2.5">
              {COMPANY.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-on-dark-muted transition-colors hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-hairline-dark pt-6">
          <p className="text-xs leading-relaxed text-on-dark-muted">
            © {year} {SITE_NAME}. All rights reserved. Content is for general informational
            purposes only and is not professional coaching, medical or purchasing advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
