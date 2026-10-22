import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import { getCategories, getCategoryBySlug, getPostsByCategory } from "@/lib/blog";
import { jsonLd, breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { brandDescription, SITE_NAME } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getCategories()).map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: "Topic not found" };
  return {
    title: `${category.name}: Pickleball ${category.name}`,
    description: brandDescription(category.description ?? `${category.name} articles and guides from ${SITE_NAME}.`),
    alternates: { canonical: `/blog/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) notFound();

  const posts = await getPostsByCategory(category.id).catch(() => []);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: category.name },
  ];

  return (
    <>
      <script
        {...jsonLd(
          breadcrumbSchema(crumbs.map((c) => ({ name: c.label, url: c.href ?? `/blog/category/${slug}` }))),
          collectionPageSchema({
            url: `/blog/category/${slug}`,
            name: category.name,
            description: category.description ?? `${category.name} articles from ${SITE_NAME}.`,
            items: posts.map((p) => ({ name: p.title, url: `/blog/${p.slug}` })),
          }),
        )}
      />

      <section className="bg-navy text-on-dark">
        <div className="container-site py-14">
          <Breadcrumbs items={crumbs} />
          <h1 className="display-lg mt-4 text-on-dark">{category.name}</h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-[17px] text-on-dark-muted">{category.description}</p>
          )}
        </div>
      </section>

      <section className="container-site py-12">
        {posts.length === 0 ? (
          <p className="text-steel">No articles in this topic yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
