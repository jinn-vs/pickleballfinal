import { revalidateTag } from "next/cache";
import { BLOG_TAG } from "@/lib/supabase";

/**
 * Supabase webhook target. Configure a database webhook on the `article`
 * table to POST here with header `x-revalidate-secret: <REVALIDATE_SECRET>`
 * so published changes appear instantly instead of waiting for ISR.
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidateTag(BLOG_TAG);
  return Response.json({ revalidated: true, now: Date.now() });
}
