import { absoluteUrl, CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

type Schema = Record<string, unknown>;

/**
 * Props for a <script type="application/ld+json">. Several schemas are
 * emitted as one @graph; "<" is escaped so content can't close the tag.
 */
export function jsonLd(...schemas: Schema[]) {
  const graph = schemas.map((s) => {
    const copy = { ...s };
    delete copy["@context"];
    return copy;
  });
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return { type: "application/ld+json", dangerouslySetInnerHTML: { __html: json } };
}

export const organizationSchema = (): Schema => ({
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
});

export const websiteSchema = (): Schema => ({
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: { "@id": `${SITE_URL}/#organization` },
});

export function breadcrumbSchema(items: { name: string; url: string }[]): Schema {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function blogSchema({
  url,
  name,
  description,
  posts = [],
}: {
  url: string;
  name: string;
  description: string;
  posts?: { title: string; slug: string; publishedAt: string }[];
}): Schema {
  return {
    "@type": "Blog",
    "@id": `${absoluteUrl(url)}#blog`,
    url: absoluteUrl(url),
    name,
    description,
    inLanguage: "en-US",
    publisher: organizationSchema(),
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.publishedAt,
    })),
  };
}

export function collectionPageSchema({
  url,
  name,
  description,
  items,
}: {
  url: string;
  name: string;
  description: string;
  items: { name: string; url: string }[];
}): Schema {
  return {
    "@type": "CollectionPage",
    "@id": absoluteUrl(url),
    url: absoluteUrl(url),
    name,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.url),
      })),
    },
  };
}

export function blogPostingSchema(p: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image?: string | null;
  authorName?: string | null;
  authorBio?: string | null;
  authorAvatar?: string | null;
  section?: string | null;
  keywords?: string | null;
  wordCount?: number;
  readMinutes?: number;
}): Schema {
  const url = absoluteUrl(p.url);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: p.headline.slice(0, 110),
    description: p.description,
    datePublished: p.datePublished,
    dateModified: p.dateModified ?? p.datePublished,
    inLanguage: "en-US",
    ...(p.image ? { image: [p.image] } : {}),
    author: p.authorName
      ? {
          "@type": "Person",
          name: p.authorName,
          ...(p.authorBio ? { description: p.authorBio } : {}),
          ...(p.authorAvatar ? { image: p.authorAvatar } : {}),
        }
      : organizationSchema(),
    publisher: organizationSchema(),
    isPartOf: { "@id": `${absoluteUrl("/blog")}#blog` },
    ...(p.section ? { articleSection: p.section } : {}),
    ...(p.keywords ? { keywords: p.keywords } : {}),
    ...(p.wordCount ? { wordCount: p.wordCount } : {}),
    ...(p.readMinutes ? { timeRequired: `PT${p.readMinutes}M` } : {}),
  };
}
