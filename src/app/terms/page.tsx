import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms and conditions for using ${SITE_NAME}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-navy text-on-dark">
        <div className="container-site py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
          <h1 className="display-lg mt-4 text-on-dark">Terms of Service</h1>
        </div>
      </section>
      <section className="container-site max-w-3xl py-12">
        <div className="article-body">
          <p><em>Last updated: {new Date().getFullYear()}</em></p>
          <p>
            By accessing and using {SITE_NAME}, you agree to these Terms of Service. If you do not
            agree, please do not use the site.
          </p>
          <h2>Use of content</h2>
          <p>
            All content is for general informational purposes only. You may read and share links to
            our articles, but you may not copy or republish our content without permission.
          </p>
          <h2>No professional advice</h2>
          <p>
            Our guides on technique, fitness and gear are general information, not professional
            medical, coaching or purchasing advice. Play within your limits and consult a
            professional where appropriate.
          </p>
          <h2>Accuracy &amp; external links</h2>
          <p>
            We aim to keep information accurate and up to date but make no guarantees, and are not
            responsible for content on external sites we link to.
          </p>
          <h2>Changes</h2>
          <p>We may update these terms at any time. Continued use means you accept the current terms.</p>
        </div>
      </section>
    </>
  );
}
