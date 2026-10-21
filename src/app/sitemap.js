// app/sitemap.js → /sitemap.xml
//
// Static pages plus every published blog post and category, read from Supabase
// through the same cached helpers the blog pages use. If the CMS is unreachable
// the static URLs are still served rather than a 500.

import { getCategories, getPublishedPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog/categories", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

/** @returns {Promise<import("next").MetadataRoute.Sitemap>} */
export default async function sitemap() {
  const now = new Date();
  const entries = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);

    const latest = posts[0]?.updatedAt;
    if (latest) {
      const blog = entries.find((e) => e.url === `${SITE_URL}/blog`);
      if (blog) blog.lastModified = new Date(latest);
    }

    for (const c of categories) {
      if (c.postCount === 0) continue;
      const newest = posts.find((p) => p.category?.id === c.id);
      entries.push({
        url: `${SITE_URL}/blog/category/${c.slug}`,
        lastModified: newest ? new Date(newest.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const p of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "monthly",
        priority: 0.7,
        ...(p.featuredImage ? { images: [p.featuredImage] } : {}),
      });
    }
  } catch (err) {
    console.error("[sitemap] blog entries skipped:", err);
  }

  return entries;
}
