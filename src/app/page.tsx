import Hero from "@/components/Hero";
import LatestArticles from "@/components/LatestArticles";
import CategorySection from "@/components/CategorySection";
import { getCategories, getPublishedPosts, type Category, type PostSummary } from "@/lib/blog";

export const revalidate = 300;

export default async function HomePage() {
  let posts: PostSummary[] = [];
  let categories: Category[] = [];
  try {
    [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  } catch (err) {
    console.error("[home] data unavailable:", err);
  }

  const withPosts = categories.filter((c) => c.postCount > 0);

  return (
    <>
      <Hero />

      {posts.length > 0 ? (
        <>
          <LatestArticles posts={posts.slice(0, 5)} />
          {withPosts.map((c) => (
            <CategorySection
              key={c.id}
              name={c.name}
              slug={c.slug}
              posts={posts.filter((p) => p.category?.id === c.id)}
            />
          ))}
        </>
      ) : (
        <section className="container-site py-24 text-center">
          <h2 className="display-sm">Articles are on the way.</h2>
          <p className="mx-auto mt-3 max-w-md text-steel">
            New pickleball guides, rules explainers and gear reviews will appear here as soon as
            they&apos;re published.
          </p>
        </section>
      )}
    </>
  );
}
