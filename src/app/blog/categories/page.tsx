import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, type Category } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Browse Pickleball Topics",
  description: `Browse ${SITE_NAME} by topic: basics, rules, strategy, gear and more.`,
  alternates: { canonical: "/blog/categories" },
};

export default async function CategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (err) {
    console.error("[categories] data unavailable:", err);
  }

  return (
    <>
      <section className="bg-navy text-on-dark">
        <div className="container-site py-14">
          <h1 className="display-lg text-on-dark">Browse topics</h1>
        </div>
      </section>

      <section className="container-site py-12">
        {categories.length === 0 ? (
          <p className="text-steel">No categories yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link key={c.id} href={`/blog/category/${c.slug}`} className="card card-hover block p-6">
                <h2 className="text-[20px] font-semibold text-ink">{c.name}</h2>
                {c.description && <p className="mt-2 text-[14.5px] leading-relaxed text-steel clamp-3">{c.description}</p>}
                <span className="mt-4 inline-block text-[13px] font-semibold text-blue">
                  {c.postCount} article{c.postCount === 1 ? "" : "s"} →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
