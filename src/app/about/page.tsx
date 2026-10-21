import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE_NAME} — our mission to make pickleball easy to learn and fun to master.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy text-on-dark">
        <div className="container-site py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <h1 className="display-lg mt-4 text-on-dark">About {SITE_NAME}</h1>
        </div>
      </section>
      <section className="container-site max-w-3xl py-12">
        <div className="article-body">
          <p>
            {SITE_NAME} is your home for everything pickleball — the fastest-growing sport in the
            world. We cover the latest news, clear rules explainers, practical drills, honest gear
            and paddle reviews, and strategy for players at every level.
          </p>
          <h2>What we do</h2>
          <p>
            Our goal is simple: make it easier to learn, improve and enjoy pickleball. Whether you
            just picked up a paddle or you&apos;re chasing your next tournament win, you&apos;ll find
            straightforward, well-researched content written for real players.
          </p>
          <h2>Why trust us</h2>
          <p>
            Every article is written and reviewed with care, kept up to date, and focused on being
            genuinely useful — not filler. We play too, and we write the guides we wish we&apos;d had
            when we started.
          </p>
          <h2>Get in touch</h2>
          <p>
            Have a question, correction or story tip? Head to our <a href="/contact">contact page</a>.
          </p>
        </div>
      </section>
    </>
  );
}
