import Link from "next/link";
import type { PostSummary } from "@/lib/blog";
import PostCard from "./PostCard";

export default function CategorySection({
  name,
  slug,
  posts,
}: {
  name: string;
  slug: string;
  posts: PostSummary[];
}) {
  if (posts.length === 0) return null;
  return (
    <section className="container-site border-t border-hairline py-14">
      <div className="mb-7 flex items-end justify-between gap-4">
        <h2 className="display-sm">{name}</h2>
        <Link
          href={`/blog/category/${slug}`}
          className="shrink-0 text-[14px] font-semibold text-ink hover:text-blue"
        >
          View all →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.slice(0, 4).map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
