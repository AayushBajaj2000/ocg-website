import type { INavLinkCardImage } from "@/types/components";

export type BlogCategory = "design" | "development" | "technology" | "marketing" | "news";

export type BlogCategoryFilterValue = BlogCategory | "all";

export interface IBlogCategoryFilter {
  label: string;
  value: BlogCategoryFilterValue;
}

export interface IBlogPostImage extends INavLinkCardImage {
  url: string;
}

export interface IBlogPost {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  author?: string;
  readingTime: number;
  categories: BlogCategory[];
  image?: IBlogPostImage;
}

/** Raw shape returned by `BLOG_POSTS_QUERY`, before normalization. */
export interface SanityBlogPost {
  id: string;
  slug: string;
  title: string | null;
  publishedAt: string | null;
  tags: string[];
  author: string | null;
  readingTime: number;
  image: { url: string; altText: string | null; lqip: string | null } | null;
}
