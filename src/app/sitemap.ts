import type { MetadataRoute } from "next";
import { fetchBlogPosts } from "@/lib/blog/server";
import { blogPostHref } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env/server";
import { PAGE_SEO } from "@/lib/seo/pages";

// ISR: regenerated at most hourly, so new blog posts appear without a deploy. Must be a literal for
// Next's static analysis — keep in sync with SANITY_REVALIDATE_SECONDS.
export const revalidate = 3600;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const site = getSiteUrl();
  const posts = await fetchBlogPosts();

  return [
    ...Object.values(PAGE_SEO).map(({ path }) => ({ url: `${site}${path === "/" ? "" : path}` })),
    ...posts.map((post) => ({
      url: `${site}${blogPostHref(post.slug)}`,
      // Only posts carry a real date; a made-up lastModified on the rest teaches crawlers to
      // ignore the field.
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
    })),
  ];
};

export default sitemap;
