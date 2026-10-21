import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-on-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 120% at 82% 65%, rgba(22,34,64,0.9) 0%, rgba(11,19,43,1) 62%)" }}
      />
      <div className="container-site relative">
        <div className="grid items-center gap-8 md:min-h-[400px] md:grid-cols-[1.15fr_0.85fr]">
          <div className="py-12 md:py-14">
            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand">{SITE_NAME}</span>
            <h1 className="display-lg mt-4 max-w-2xl text-on-dark">
              Master pickleball — from your first serve to the tournament court.
            </h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-on-dark-muted">
              Clear rules, practical drills, honest gear reviews and winning strategy — written for
              real players at every level.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/blog" className="btn btn-on-dark">
                Read the latest guides →
              </Link>
              <Link href="/blog/categories" className="btn btn-secondary-on-dark">
                Browse topics
              </Link>
            </div>
          </div>

          {/* right column reserves space; the player is pinned to the hero's bottom edge */}
          <div className="hidden md:block" aria-hidden />
        </div>

        {/* Player — feet flush with the bottom of the hero section */}
        <Image
          src="/player.webp"
          alt="Pickleball player"
          width={528}
          height={598}
          priority
          className="pointer-events-none absolute bottom-0 right-0 hidden h-auto max-h-[360px] w-auto object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.5)] md:block"
        />
      </div>
    </section>
  );
}
