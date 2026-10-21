import Link from "next/link";
import Image from "next/image";
import type { PostSummary } from "@/lib/blog";
import { postDate } from "@/lib/blog";

export default function PostCard({
  post,
  headingLevel = "h3",
}: {
  post: PostSummary;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const href = `/blog/${post.slug}`;
  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <Link href={href} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-soft">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">Pickleballreads</div>
          )}
          {post.category && (
            <span className="badge badge-brand absolute left-3 top-3">{post.category.name}</span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={href}>
          <Heading className="text-[19px] font-semibold leading-snug text-ink transition-colors group-hover:text-blue clamp-2">
            {post.title}
          </Heading>
        </Link>
        {post.excerpt && <p className="mt-2 text-[14.5px] leading-relaxed text-steel clamp-3">{post.excerpt}</p>}
        <div className="mt-4 flex items-center gap-2 pt-1 text-[13px] text-muted">
          {post.author?.name && <span className="font-medium text-slate">{post.author.name}</span>}
          {post.author?.name && <span aria-hidden>·</span>}
          <time dateTime={post.publishedAt}>{postDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}
