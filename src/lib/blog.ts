import "server-only";
import { cache } from "react";
import { processArticleHtml, type TocItem } from "./blog-html";
import { SITE_URL } from "./site";
import { sb } from "./supabase";

export { SITE_URL };
export type { TocItem };

// Tables (Supabase): article, authors, categories_article, tags_article,
// article_categories (post_id, category_id), article_tags (post_id, tag_id).

export interface Author {
  name: string;
  bio: string | null;
  avatar: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  publishedAt: string;
  updatedAt: string;
  author: Author | null;
  category: Omit<Category, "postCount" | "description"> | null;
  readTime: string;
}

export interface Post extends PostSummary {
  content: string;
  toc: TocItem[];
  wordCount: number;
  tags: Tag[];
  seo: { title: string; description: string; keywords: string | null };
}

interface Row {
  id: string;
  slug: string;
  title: string;
  content?: string;
  excerpt: string | null;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  author: { name: string; bio: string | null; avatar_url: string | null } | null;
  article_categories: { category: { id: string; name: string; slug: string } | null }[];
  article_tags?: { tag: Tag | null }[];
}

const EMBED = "author:authors(name,bio,avatar_url),article_categories(category:categories_article(id,name,slug))";
const SUMMARY = `id,slug,title,excerpt,featured_image_url,created_at,updated_at,content,${EMBED}`;

function toSummary(r: Row): PostSummary {
  const minutes = r.content ? processArticleHtml(r.content).readMinutes : 1;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    featuredImage: r.featured_image_url || null,
    publishedAt: r.created_at,
    updatedAt: r.updated_at ?? r.created_at,
    author: r.author ? { name: r.author.name, bio: r.author.bio || null, avatar: r.author.avatar_url || null } : null,
    category: r.article_categories.find((c) => c.category)?.category ?? null,
    readTime: `${minutes} min read`,
  };
}

/** All published posts, newest first. Cached per request and for 5 minutes across requests. */
export const getPublishedPosts = cache(async (): Promise<PostSummary[]> => {
  const rows = await sb<Row[]>(`article?select=${SUMMARY}&published=eq.true&order=created_at.desc`);
  return rows.map(toSummary);
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const [cats, posts] = await Promise.all([
    sb<Omit<Category, "postCount">[]>("categories_article?select=id,name,slug,description&order=name.asc"),
    getPublishedPosts(),
  ]);
  // Counted from published posts, so drafts never inflate a badge.
  return cats
    .map((c) => ({ ...c, postCount: posts.filter((p) => p.category?.id === c.id).length }))
    .sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name));
});

export async function getCategoryBySlug(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getPostsByCategory(categoryId: string) {
  return (await getPublishedPosts()).filter((p) => p.category?.id === categoryId);
}

export async function getPostSlugs() {
  return (await getPublishedPosts()).map((p) => p.slug);
}

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  if (!/^[a-z0-9-]{1,200}$/i.test(slug)) return null;
  const rows = await sb<Row[]>(
    `article?select=*,${EMBED},article_tags(tag:tags_article(id,name))&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  );
  const r = rows[0];
  if (!r) return null;
  const body = processArticleHtml(r.content ?? "");
  const summary = toSummary({ ...r, content: undefined });
  return {
    ...summary,
    featuredImage: summary.featuredImage ?? body.firstImage,
    readTime: `${body.readMinutes} min read`,
    content: body.html,
    toc: body.toc,
    wordCount: body.wordCount,
    tags: (r.article_tags ?? []).map((t) => t.tag).filter((t): t is Tag => Boolean(t)),
    seo: {
      title: r.seo_title || r.title,
      description: r.seo_description || r.excerpt || "",
      keywords: r.seo_keywords || null,
    },
  };
});

/** Same category first, then most recent. */
export async function getRelatedPosts(post: Pick<PostSummary, "id" | "category">, limit = 3) {
  const all = (await getPublishedPosts()).filter((p) => p.id !== post.id);
  const same = all.filter((p) => post.category && p.category?.id === post.category.id);
  const rest = all.filter((p) => !same.includes(p));
  return [...same, ...rest].slice(0, limit);
}

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

export const postDate = (iso: string) => fmt(iso, { month: "short", day: "numeric", year: "numeric" });
export const postDateLong = (iso: string) => fmt(iso, { month: "long", day: "numeric", year: "numeric" });
