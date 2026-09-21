import type { ITocItem } from "@/types/components";
import type { PortableTextBlock } from "@/types/portableText";
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

export interface IBlogAuthor {
  name: string;
  role?: string;
  image?: ISanityImage;
}

export type BlogHeadingLevel = 2 | 3 | 4 | 5;

/** The post body, regrouped for rendering: runs of text, fenced code, and inline images. */
export type BlogBodyNode =
  | { kind: "text"; key: string; blocks: PortableTextBlock[] }
  | { kind: "code"; key: string; code: string }
  | { kind: "image"; key: string; image: ISanityImage };

export interface IBlogPostDetail extends Omit<IBlogPost, "author"> {
  updatedAt: string;
  author?: IBlogAuthor;
  /** Where the wide hero crop centres: the CMS hotspot, or the upper part of the picture. */
  imageFocus: { x: number; y: number };
  /** Opening of the body as plain text, trimmed for a meta description. */
  excerpt: string;
  body: BlogBodyNode[];
  /** Heading `_key` → anchor id, for every heading in the body. */
  headingIds: Record<string, string>;
  toc: ITocItem[];
}

export interface SanityBlogImageBlock {
  _type: "image";
  _key: string;
  asset: SanityImageAsset | null;
}

/** Raw shape returned by `BLOG_POST_QUERY`, before normalization. */
export interface SanityBlogPostDetail extends Omit<SanityBlogPost, "author"> {
  updatedAt: string;
  author: { name: string | null; role: string | null; image: SanityImageAsset | null } | null;
  excerpt: string | null;
  imageFocus: { x: number | null; y: number | null } | null;
  body: Array<PortableTextBlock | SanityBlogImageBlock>;
}
