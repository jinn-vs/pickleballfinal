import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import { getPublishedPosts, type PostSummary } from "@/lib/blog";
import { SITE_NAME } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pickleball Blog: Guides, Rules, Drills & Gear",
  description: `Every article from ${SITE_NAME}: rules explainers, drills, strategy and honest pickleball gear reviews.`,
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  let posts: PostSummary[] = [];
  try {
    posts = await getPublishedPosts();
  } catch (err) {
    console.error("[blog] data unavailable:", err);
  }

  const filtered = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query) ||
          p.category?.name.toLowerCase().includes(query),
      )
    : posts;

  return (
    <>
      <section className="bg-navy text-on-dark">
        <div className="container-site py-14">
          <h1 className="display-lg text-on-dark">The Pickleball Blog</h1>
          <p className="mt-3 max-w-xl text-[17px] text-on-dark-muted">
            News, rules, drills, strategy and gear, everything to help you play better.
          </p>
          <div className="mt-6 max-w-md">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container-site py-12">
        {query && (
          <p className="mb-6 text-sm text-steel">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-ink">“{q}”</span>
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="text-steel">No articles found{query ? " for that search" : " yet"}.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
