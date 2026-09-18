import "server-only";
import { getSanityClient } from "@/lib/sanity/client";
import { BLOG_POSTS_QUERY } from "@/lib/sanity/queries";
import {
  BLOG_CACHE_TAG,
  BLOG_CATEGORY_LABELS,
  BLOG_REVALIDATE_SECONDS,
  BLOG_TAG_ALIASES,
} from "@/lib/constants/blog";
import type { BlogCategory, IBlogPost, SanityBlogPost } from "@/types";

const isBlogCategory = (value: string): value is BlogCategory => value in BLOG_CATEGORY_LABELS;

const toBlogCategories = (tags: string[]): BlogCategory[] => {
  const categories = tags
    .map((tag) => tag.trim().toLowerCase())
    .map((tag) => BLOG_TAG_ALIASES[tag] ?? tag)
    .filter(isBlogCategory);

  return [...new Set(categories)];
};

const normalizeBlogPost = ({
  id,
  slug,
  title,
  publishedAt,
  tags,
  author,
  readingTime,
  image,
}: SanityBlogPost): IBlogPost => ({
  id,
  slug,
  title: title?.trim() ?? "",
  publishedAt: publishedAt ?? "",
  author: author ?? undefined,
  readingTime,
  categories: toBlogCategories(tags),
  // The card title already names the link, so an unset alt stays empty (decorative).
  image: image
    ? { url: image.url, alt: image.altText ?? "", blurDataURL: image.lqip ?? undefined }
    : undefined,
});

/** Queries Sanity directly. Cached by Next's data cache for the blog ISR window. */
export const fetchBlogPosts = async (): Promise<IBlogPost[]> => {
  const posts = await getSanityClient().fetch<SanityBlogPost[]>(
    BLOG_POSTS_QUERY,
    {},
    { next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] } },
  );

  return posts.map(normalizeBlogPost);
};
