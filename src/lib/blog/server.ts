import "server-only";
import { sanityFetch } from "@/lib/sanity/client";
import { toSanityImage } from "@/lib/sanity/image";
import { BLOG_POST_QUERY, BLOG_POST_SLUGS_QUERY, BLOG_POSTS_QUERY } from "@/lib/sanity/queries";
import { SANITY_CACHE_TAGS } from "@/lib/constants/sanity";
import { BLOG_CATEGORY_LABELS, BLOG_TAG_ALIASES } from "@/lib/constants/blog";
import { toBlogBody, toBlogHeadings } from "@/lib/blog/body";
import type {
  BlogCategory,
  IBlogPost,
  IBlogPostDetail,
  SanityBlogPost,
  SanityBlogPostDetail,
} from "@/types";

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

const EXCERPT_LENGTH = 160;

// The hero is a wide strip of a 16:10 cover, so nearly half the height is cropped away. Subjects
// sit in the upper half far more often than the lower, so the strip leans up unless an editor set
// a hotspot.
const DEFAULT_HERO_FOCUS = { x: 0.5, y: 0.35 };

const toExcerpt = (text: string | null): string => {
  const flat = (text ?? "").replace(/\s+/g, " ").trim();
  if (flat.length <= EXCERPT_LENGTH) return flat;
  return `${flat.slice(0, flat.lastIndexOf(" ", EXCERPT_LENGTH)).replace(/[\s,;:.–—-]+$/, "")}…`;
};

export const fetchBlogPostSlugs = (): Promise<string[]> =>
  sanityFetch<string[]>(BLOG_POST_SLUGS_QUERY, SANITY_CACHE_TAGS.blog);

/** One post with its body, or `null` when the slug matches nothing. */
export const fetchBlogPost = async (slug: string): Promise<IBlogPostDetail | null> => {
  const post = await sanityFetch<SanityBlogPostDetail | null>(
    BLOG_POST_QUERY,
    SANITY_CACHE_TAGS.blog,
    { slug },
  );
  if (!post) return null;

  const { author, excerpt, imageFocus, body: rawBody, updatedAt, ...card } = post;
  const body = toBlogBody(rawBody);
  const authorName = author?.name?.trim();

  return {
    ...normalizeBlogPost({ ...card, author: null }),
    updatedAt,
    author: authorName
      ? {
          name: authorName,
          role: author?.role?.trim() || undefined,
          image: toSanityImage(author?.image ?? null),
        }
      : undefined,
    excerpt: toExcerpt(excerpt),
    imageFocus: {
      x: imageFocus?.x ?? DEFAULT_HERO_FOCUS.x,
      y: imageFocus?.y ?? DEFAULT_HERO_FOCUS.y,
    },
    body,
    ...toBlogHeadings(body),
  };
};
