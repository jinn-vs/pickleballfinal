import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses and protects your information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-navy text-on-dark">
        <div className="container-site py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
          <h1 className="display-lg mt-4 text-on-dark">Privacy Policy</h1>
        </div>
      </section>
      <section className="container-site max-w-3xl py-12">
        <div className="article-body">
          <p><em>Last updated: {new Date().getFullYear()}</em></p>
          <p>
            This Privacy Policy explains how {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) handles
            information when you visit our website. By using the site, you agree to the practices
            described here.
          </p>
          <h2>Information we collect</h2>
          <p>
            We may collect basic, non-identifying usage data (such as pages visited and general
            location) through standard analytics to understand how the site is used and improve it.
            If you email us, we keep your message and address only to respond.
          </p>
          <h2>Cookies &amp; analytics</h2>
          <p>
            We may use cookies and third-party analytics to measure traffic and improve the
            experience. You can control cookies through your browser settings.
          </p>
          <h2>Third-party links</h2>
          <p>
            Our articles may link to external websites. We are not responsible for the privacy
            practices or content of those sites.
          </p>
          <h2>Changes</h2>
          <p>We may update this policy from time to time. Changes will be posted on this page.</p>
        </div>
      </section>
    </>
  );
}
