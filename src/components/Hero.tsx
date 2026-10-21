import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-on-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 120% at 82% 60%, rgba(22,34,64,0.9) 0%, rgba(11,19,43,1) 62%)" }}
      />
      <div className="container-site relative">
        <div className="grid items-center gap-8 py-14 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div>
            <span className="badge badge-navy">{SITE_NAME}</span>
            <h1 className="display-xl mt-5 max-w-2xl text-on-dark">
              Master pickleball — from your first serve to the tournament court.
            </h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-on-dark-muted">
              Clear rules, practical drills, honest gear reviews and winning strategy — written for
              real players at every level.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/blog" className="btn btn-on-dark">
                Read the latest guides →
              </Link>
              <Link href="/blog/categories" className="btn btn-secondary-on-dark">
                Browse topics
              </Link>
            </div>
          </div>

          <div className="relative hidden justify-center md:flex">
            <Image
              src="/player.webp"
              alt="Pickleball player"
              width={528}
              height={598}
              priority
              className="h-auto max-h-[440px] w-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
