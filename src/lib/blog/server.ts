import "server-only";
import { sanityFetch } from "@/lib/sanity/client";
import { toSanityImage } from "@/lib/sanity/image";
import { BLOG_POSTS_QUERY } from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/constants/sanity";
import { BLOG_CATEGORY_LABELS, BLOG_TAG_ALIASES } from "@/lib/constants/blog";
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
  image: toSanityImage(image),
});

/** Queries Sanity directly. Cached by Next's data cache for the content ISR window. */
export const fetchBlogPosts = async (): Promise<IBlogPost[]> => {
  const posts = await sanityFetch<SanityBlogPost[]>(BLOG_POSTS_QUERY, SANITY_CACHE_TAGS.blog);
  return posts.map(normalizeBlogPost);
};
