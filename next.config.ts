import type { NextConfig } from "next";
import { withEve } from "eve/next";

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
  //
  // Permanent (308) only where the destination is the page's real successor: search engines then
  // move the old URL's ranking to it. Temporary (307) where the destination is a stand-in for a
  // page that doesn't exist yet: that keeps the old URL indexed, so building the real page later
  // doesn't start from zero.
  redirects: async () => [
    // The blog, renamed. Post slugs are unchanged.
    { source: "/insights", destination: "/blog", permanent: true },
    { source: "/insights/:slug", destination: "/blog/:slug", permanent: true },
    { source: "/about", destination: "/company", permanent: true },
    { source: "/projects", destination: "/work", permanent: true },
    {
      source: "/projects/:slug(anesthesia-one|fraiche-table|page-flooring)",
      destination: "/work/:slug",
      permanent: true,
    },
    // Case studies without a page here yet (DentiMatch, Eclectic Events, eFundrs, Taurus,
    // ThreadBreak, OpenCore). Make each one permanent, to its own page, when that page is built.
    { source: "/projects/:slug", destination: "/work", permanent: false },
    // Resources open in a popup for now rather than on a page of their own.
    { source: "/resources/:slug", destination: "/resources?resource=:slug", permanent: false },
    // The legal documents used to be PDFs; they are pages now.
    { source: "/pdfs/ocg-website-privacy-policy.pdf", destination: "/privacy", permanent: true },
    { source: "/pdfs/ocg-website-terms-of-use.pdf", destination: "/terms", permanent: true },
    // Share images the old site's pages pointed at; links already posted on social still load them.
    { source: "/openGraph/:file", destination: "/og/home", permanent: false },
    // Shortcut editors have bookmarked. The Studio is hosted by Sanity.
    { source: "/studio", destination: "https://opencoregroup.sanity.studio", permanent: false },
    {
      source: "/studio/:path*",
      destination: "https://opencoregroup.sanity.studio/:path*",
      permanent: false,
    },
  ],
};

// Mounts the website assistant (agent/ at the repo root) under same-origin /eve/v1/*.
// Who may call it, and how often, is decided in agent/channels/eve.ts.
export default withEve(nextConfig);
