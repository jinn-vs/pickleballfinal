import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import TocNav from "@/components/TocNav";
import { getPost, getPostSlugs, getRelatedPosts, postDateLong } from "@/lib/blog";
import { jsonLd, blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { brandDescription, brandTitle, SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getPostSlugs()).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };

  const url = `${SITE_URL}/blog/${slug}`;
  const description = brandDescription(post.seo.description);
  const images = post.featuredImage ? [{ url: post.featuredImage, alt: post.title }] : undefined;

  return {
    title: { absolute: brandTitle(post.seo.title) },
    description,
    keywords: post.seo.keywords ?? undefined,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: brandTitle(post.seo.title),
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      section: post.category?.name,
      tags: post.tags.map((t) => t.name),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: post.featuredImage ? "summary_large_image" : "summary",
      title: brandTitle(post.seo.title),
      description,
      ...(post.featuredImage ? { images: [post.featuredImage] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 3).catch(() => []);
  const sections = post.toc.filter((t) => t.level === 2);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(post.category ? [{ label: post.category.name, href: `/blog/category/${post.category.slug}` }] : []),
    { label: post.title },
  ];

  return (
    <article className="container-site py-10 md:py-14">
      <script
        {...jsonLd(
          blogPostingSchema({
            url: `/blog/${slug}`,
            headline: post.seo.title,
            description: post.seo.description,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            image: post.featuredImage,
            authorName: post.author?.name,
            authorBio: post.author?.bio,
            authorAvatar: post.author?.avatar,
            section: post.category?.name,
            keywords: post.seo.keywords,
            wordCount: post.wordCount,
            readMinutes: parseInt(post.readTime, 10),
          }),
          breadcrumbSchema(crumbs.map((c) => ({ name: c.label, url: c.href ?? `/blog/${slug}` }))),
        )}
      />

      <header className="max-w-3xl">
        <Breadcrumbs items={crumbs} />
        {post.category && (
          <Link href={`/blog/category/${post.category.slug}`} className="badge badge-soft mt-6 inline-flex">
            {post.category.name}
          </Link>
        )}
        <h1 className="display-lg mt-4">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-[19px] leading-relaxed text-slate">{post.excerpt}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-[14px] text-steel">
          {post.author?.name && (
            <span className="flex items-center gap-2">
              {post.author.avatar && (
                // eslint-disable-next-line @next/next/no-img-element -- avatars live on arbitrary hosts
                <img src={post.author.avatar} alt={post.author.name} className="h-6 w-6 rounded-full object-cover" />
              )}
              <span className="font-semibold text-ink">{post.author.name}</span>
            </span>
          )}
          {post.author?.name && <span aria-hidden>·</span>}
          <time dateTime={post.publishedAt}>{postDateLong(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      {post.featuredImage && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-surface-soft">
          <Image src={post.featuredImage} alt={post.title} fill priority sizes="(max-width: 1024px) 100vw, 1000px" className="object-cover" />
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          {sections.length > 1 && (
            <details className="mb-8 rounded-[var(--radius-lg)] border border-hairline bg-surface p-5 lg:hidden">
              <summary className="cursor-pointer text-[15px] font-semibold text-ink">On this page</summary>
              <ol className="mt-3 space-y-1.5">
                {sections.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-[14px] text-steel hover:text-ink">{t.text}</a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />

          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-hairline pt-6" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t.id} className="rounded-[var(--radius-full)] bg-surface px-3 py-1 text-[13px] font-medium text-slate">
                  #{t.name}
                </li>
              ))}
            </ul>
          )}

          {post.author && (
            <div className="mt-10 flex gap-4 rounded-[var(--radius-lg)] bg-surface p-6">
              {post.author.avatar && (
                // eslint-disable-next-line @next/next/no-img-element -- avatars live on arbitrary hosts
                <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 flex-shrink-0 rounded-full object-cover" />
              )}
              <div>
                <p className="text-[13px] text-steel">Written by</p>
                <p className="font-semibold text-ink">{post.author.name}</p>
                {post.author.bio && <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate">{post.author.bio}</p>}
              </div>
            </div>
          )}
        </div>

        {sections.length > 1 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)]">
              <TocNav toc={sections} />
            </div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-20 border-t border-hairline pt-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 id="related" className="display-sm">Recommended reads</h2>
            <Link href="/blog" className="shrink-0 text-[14px] font-semibold text-ink hover:text-blue">All articles →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
