import { BLOG_CATEGORY_LABELS, blogPostHref } from "@/lib/constants/blog";
import type { BlogCategory, BlogCategoryFilterValue, IBlogPost, INavLinkCard } from "@/types";

// UTC: `publishedAt` is a date-only string, so a local timezone could shift it a day and make the
// server and client render different text.
const blogDateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

export const formatBlogDate = (iso: string): string =>
  iso ? blogDateFormatter.format(new Date(iso)) : "";

export const filterBlogPosts = (
  posts: IBlogPost[],
  selected: BlogCategoryFilterValue,
): IBlogPost[] =>
  selected === "all" ? posts : posts.filter((post) => post.categories.includes(selected));

/** A card shows one chip: the active filter when set (every match has it), else the first tag. */
const getCardCategory = (
  post: IBlogPost,
  selected: BlogCategoryFilterValue,
): BlogCategory | undefined => (selected === "all" ? post.categories[0] : selected);

export const toBlogCard = (post: IBlogPost, selected: BlogCategoryFilterValue): INavLinkCard => {
  const category = getCardCategory(post, selected);

  return {
    href: blogPostHref(post.slug),
    img: post.image,
    category: category && BLOG_CATEGORY_LABELS[category],
    headline: { text: formatBlogDate(post.publishedAt), dateTime: post.publishedAt },
    title: post.title,
    caption: { authorName: post.author, readTime: `${post.readingTime} min read` },
  };
};
