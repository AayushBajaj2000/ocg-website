import type { NextConfig } from "next";

// `pnpm lighthouse` builds with LIGHTHOUSE=1. Source maps let Lighthouse attribute
// cost to real source files instead of hashed chunks, and the separate distDir keeps
// that build (and its maps) away from the normal `.next` output that ships to Vercel.
const isLighthouseBuild = process.env.LIGHTHOUSE === "1";

const nextConfig: NextConfig = {
  ...(isLighthouseBuild && {
    distDir: ".next-lighthouse",
    productionBrowserSourceMaps: true,
  }),
  allowedDevOrigins: ["172.20.10.3"],
  // URLs from the previous opencoregroup.com site, so indexed pages and old links keep working.
  // Post and case-study slugs are unchanged; case studies without a new page land on /work.
  redirects: async () => [
    { source: "/insights", destination: "/blog", permanent: true },
    { source: "/insights/:slug", destination: "/blog/:slug", permanent: true },
    { source: "/about", destination: "/company", permanent: true },
    { source: "/projects", destination: "/work", permanent: true },
    {
      source: "/projects/:slug(anesthesia-one|fraiche-table|page-flooring)",
      destination: "/work/:slug",
      permanent: true,
    },
    { source: "/projects/:slug", destination: "/work", permanent: true },
    { source: "/resources/:slug", destination: "/resources?resource=:slug", permanent: true },
    // Share images the old site's pages pointed at; links already posted on social still load them.
    { source: "/openGraph/:file", destination: "/og/home", permanent: true },
  ],
};

export default nextConfig;
