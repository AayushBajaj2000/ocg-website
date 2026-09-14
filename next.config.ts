import type { NextConfig } from "next";

// `pnpm lighthouse` builds with LIGHTHOUSE=1. Source maps let Lighthouse attribute
// cost to real source files instead of hashed chunks, and the separate distDir keeps
// that build (and its maps) away from the normal `.next` output that ships to Vercel.
const isLighthouseBuild = process.env.LIGHTHOUSE === "1";

// `pnpm build:pages` sets GITHUB_PAGES=true: a fully static export into `out/`, served
// from https://<user>.github.io/<repo>/. Every other build is unchanged.
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
// Project sites live under /<repo>. Set PAGES_BASE_PATH="" when using a custom domain.
const pagesBasePath = process.env.PAGES_BASE_PATH ?? "/ocg-website";

const nextConfig: NextConfig = {
  ...(isLighthouseBuild && {
    distDir: ".next-lighthouse",
    productionBrowserSourceMaps: true,
  }),
  ...(isGithubPagesBuild && {
    output: "export",
    basePath: pagesBasePath,
    // GitHub Pages serves /work/index.html for /work/, not /work.html for /work.
    trailingSlash: true,
    // No image optimization server on Pages; this loader just prefixes the basePath.
    images: { loader: "custom", loaderFile: "./src/lib/pages-image-loader.ts" },
    env: { NEXT_PUBLIC_BASE_PATH: pagesBasePath },
  }),
};

export default nextConfig;
