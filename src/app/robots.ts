import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env/server";

const robots = (): MetadataRoute.Robots => ({
  // `/api/` only serves JSON to the site's own pages. `/og/` stays crawlable: those are the share
  // images, and social crawlers have to fetch them.
  rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
  sitemap: `${getSiteUrl()}/sitemap.xml`,
  host: getSiteUrl(),
});

export default robots;
