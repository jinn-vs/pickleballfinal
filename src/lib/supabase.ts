import "server-only";

/** Tag on every blog fetch; /api/revalidate purges it. */
export const BLOG_TAG = "blog";
/** Fallback freshness when no webhook fires. */
const REVALIDATE_SECONDS = 300;

/**
 * Minimal PostgREST client. Uses the public anon key: row-level security
 * already limits it to published content, so no service key ever runs here.
 */
export async function sb<T>(path: string): Promise<T> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set");
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS, tags: [BLOG_TAG] },
  });
  if (!res.ok) throw new Error(`Supabase ${path.split("?")[0]} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}
