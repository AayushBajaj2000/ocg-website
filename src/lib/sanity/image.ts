import type { ImageLoader } from "next/image";

// Sanity's image CDN resizes and negotiates AVIF/WebP itself, so images skip `/_next/image`.
export const sanityImageLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
};
