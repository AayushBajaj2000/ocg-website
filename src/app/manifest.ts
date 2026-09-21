import type { MetadataRoute } from "next";
import { PAGE_SEO, SITE_NAME } from "@/lib/seo/pages";

const manifest = (): MetadataRoute.Manifest => ({
  name: SITE_NAME,
  short_name: "OpenCore",
  description: PAGE_SEO.home.description,
  start_url: "/",
  display: "standalone",
  background_color: "#fdfdfd",
  theme_color: "#2068cc",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
});

export default manifest;
