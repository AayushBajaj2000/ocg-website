import { NextResponse } from "next/server";
import { fetchBlogPosts } from "@/lib/blog/server";
import type { IBlogPost } from "@/types";

// Browser fallback for the blog grid (Sanity rejects browser origins). Statically generated and
// regenerated on the blog ISR window; must be a literal — keep in sync with BLOG_REVALIDATE_SECONDS.
export const revalidate = 3600;

export const GET = async (): Promise<NextResponse<IBlogPost[]>> =>
  NextResponse.json(await fetchBlogPosts());
