import type { BlogCategory, IBlogCategoryFilter } from "@/types";

export const BLOG_PATH = "/blog";

export const blogPostHref = (slug: string) => `${BLOG_PATH}/${slug}`;

export const BLOG_POSTS_API_PATH = "/api/blog/posts";

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
