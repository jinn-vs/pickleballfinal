import Link from "next/link";
import Image from "next/image";
import type { PostSummary } from "@/lib/blog";
import { postDate } from "@/lib/blog";
import PostCard from "./PostCard";

export default function LatestArticles({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;
  const [featured, ...rest] = posts;
  const grid = rest.slice(0, 4);

  return (
    <section className="container-site py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="display-md">Latest articles</h2>
        <Link href="/blog" className="shrink-0 text-[14px] font-semibold text-ink hover:text-blue">
          View all →
        </Link>
      </div>

      {/* Featured */}
      <Link href={`/blog/${featured.slug}`} className="card card-hover group mb-8 grid overflow-hidden md:grid-cols-2">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-soft md:aspect-auto">
          {featured.featuredImage ? (
            <Image
              src={featured.featuredImage}
              alt={featured.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center text-muted">Pickleballreads</div>
          )}
        </div>
        <div className="flex flex-col justify-center p-7">
          {featured.category && <span className="badge badge-soft w-fit">{featured.category.name}</span>}
          <h3 className="mt-3 text-[26px] font-semibold leading-tight text-ink transition-colors group-hover:text-blue clamp-3">
            {featured.title}
          </h3>
          {featured.excerpt && <p className="mt-3 text-[15px] leading-relaxed text-steel clamp-3">{featured.excerpt}</p>}
          <div className="mt-5 flex items-center gap-2 text-[13px] text-muted">
            {featured.author?.name && <span className="font-medium text-slate">{featured.author.name}</span>}
            {featured.author?.name && <span aria-hidden>·</span>}
            <time dateTime={featured.publishedAt}>{postDate(featured.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{featured.readTime}</span>
          </div>
        </div>
      </Link>

      {/* Grid of the next four */}
      {grid.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {grid.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
