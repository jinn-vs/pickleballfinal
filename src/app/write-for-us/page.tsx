import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Write for Us",
  description: `Write for ${SITE_NAME}: contribute pickleball guides, drills, gear reviews and strategy as a guest author.`,
  alternates: { canonical: "/write-for-us" },
};

export default function WriteForUsPage() {
  return (
    <>
      <section className="bg-navy text-on-dark">
        <div className="container-site py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Write for Us" }]} />
          <h1 className="display-lg mt-4 text-on-dark">Write for Us</h1>
        </div>
      </section>

      <section className="container-site max-w-3xl py-12">
        <div className="article-body">
          <p>
            Love pickleball and love writing about it? {SITE_NAME} welcomes guest contributors. If
            you can help players learn the game, improve their skills or choose the right gear,
            we&apos;d love to hear from you, whether you&apos;re a coach, a competitive player or
            simply someone who knows the sport inside out.
          </p>

          <h2>What we&apos;re looking for</h2>
          <p>Practical, well-researched articles that genuinely help real players, such as:</p>
          <ul>
            <li>Rules explainers and beginner how-to guides</li>
            <li>Drills, training routines and skill breakdowns</li>
            <li>Honest gear and paddle reviews</li>
            <li>Strategy, tactics and match tips</li>
            <li>Pickleball news, trends and event coverage</li>
          </ul>

          <h2>Our guidelines</h2>
          <ul>
            <li>Original and unpublished, not posted anywhere else</li>
            <li>Accurate and well-researched, written for real players</li>
            <li>Around 800 words or more, with clear headings</li>
            <li>Helpful and informative, not promotional or spun content</li>
            <li>Free of plagiarism and keyword stuffing</li>
          </ul>

          <h2>What you get</h2>
          <p>
            Published pieces run with your byline and a short author bio, so your work reaches a
            growing audience of pickleball players and enthusiasts.
          </p>

          <h2>How to submit</h2>
          <p>
            Email your pitch or draft to{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Write%20for%20Us`} className="font-semibold">
              {CONTACT_EMAIL}
            </a>{" "}
            with the subject line &quot;Write for Us&quot;. Include your topic idea or draft, any
            relevant links, and a one or two line bio about yourself. We read every submission and
            reply if it&apos;s a good fit.
          </p>
        </div>
      </section>
    </>
  );
}
