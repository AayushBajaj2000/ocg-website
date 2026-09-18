import type { ISanityImage, SanityImageAsset } from "@/types/sanity";

export type BlogCategory = "design" | "development" | "technology" | "marketing" | "news";

export type BlogCategoryFilterValue = BlogCategory | "all";

export interface IBlogCategoryFilter {
  label: string;
  value: BlogCategoryFilterValue;
}

export interface IBlogPost {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  author?: string;
  readingTime: number;
  categories: BlogCategory[];
  image?: ISanityImage;
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
  image: SanityImageAsset | null;
}
