import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE_NAME} team: questions, feedback or story tips.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy text-on-dark">
        <div className="container-site py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <h1 className="display-lg mt-4 text-on-dark">Contact us</h1>
        </div>
      </section>
      <section className="container-site max-w-3xl py-12">
        <div className="article-body">
          <p>
            We&apos;d love to hear from you, whether it&apos;s a question, feedback, a correction or
            a story tip. Send us a message and we&apos;ll get back to you as soon as we can.
          </p>
          <h2>Email</h2>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold">{CONTACT_EMAIL}</a>
          </p>
        </div>
      </section>
    </>
  );
}
