import type { BlogCategory, IBlogCategoryFilter } from "@/types";

export const BLOG_PATH = "/blog";

export const blogPostHref = (slug: string) => `${BLOG_PATH}/${slug}`;

export const BLOG_POSTS_API_PATH = "/api/blog/posts";

// ISR window for blog data. `src/app/blog/page.tsx` and `src/app/api/blog/posts/route.ts` mirror it
// as a literal `revalidate` (Next requires a statically analyzable value there).
export const BLOG_REVALIDATE_SECONDS = 3600;

/** Cache tag for on-demand revalidation (e.g. a future Sanity webhook). */
export const BLOG_CACHE_TAG = "blogPost";

export const BLOG_SKELETON_COUNT = 6;

/** Cards in the first desktop row load eagerly; the first one is the LCP candidate. */
export const BLOG_EAGER_IMAGE_COUNT = 3;

export const BLOG_CARD_IMAGE_SIZES = "(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw";

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  design: "Design",
  development: "Development",
  marketing: "Marketing",
  technology: "Technology",
  news: "News",
};

export const BLOG_CATEGORIES: IBlogCategoryFilter[] = [
  { label: "All Insights", value: "all" },
  ...(Object.entries(BLOG_CATEGORY_LABELS) as [BlogCategory, string][]).map(([value, label]) => ({
    label,
    value,
  })),
];

/** CMS tag spellings that don't match a category key (the dataset stores "Techology"). */
export const BLOG_TAG_ALIASES: Record<string, BlogCategory> = {
  techology: "technology",
};
