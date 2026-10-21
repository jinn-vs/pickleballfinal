import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site py-28 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue">404</p>
      <h1 className="display-md mt-3">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-steel">
        That page doesn&apos;t exist or may have moved. Try the blog instead.
      </p>
      <Link href="/blog" className="btn btn-primary mt-7">Read the blog →</Link>
    </section>
  );
}
