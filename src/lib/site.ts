/** Canonical origin for URLs in metadata, JSON-LD and the sitemap. */
export const PRODUCTION_URL = "https://pickleballreads.com";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.APP_URL ??
  (process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000")
).replace(/\/$/, "");

export const SITE_NAME = "Pickleballreads";
export const SITE_DESCRIPTION =
  "Pickleball news, rules, drills, gear reviews and strategy — everything you need to learn the game and level up, from first serve to tournament play.";
export const CONTACT_EMAIL = "hello@pickleballreads.com";

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

/** "Title · Pickleballreads", unless the title already names the brand. */
export function brandTitle(title: string) {
  return /pickleballreads/i.test(title) ? title : `${title} · ${SITE_NAME}`;
}

/** Search engines truncate around 160 characters; cut on a word boundary. */
export function brandDescription(text: string | null | undefined, max = 160) {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t || SITE_DESCRIPTION;
  return `${t.slice(0, t.lastIndexOf(" ", max - 1)).replace(/[,;:.\s]+$/, "")}…`;
}
