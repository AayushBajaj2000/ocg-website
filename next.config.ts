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
};

export default nextConfig;
