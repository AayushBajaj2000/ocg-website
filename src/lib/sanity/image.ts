import type { ImageLoader } from "next/image";
import type { ISanityImage, SanityImageAsset } from "@/types";

// Sanity's image CDN resizes and negotiates AVIF/WebP itself, so images skip `/_next/image`.
export const sanityImageLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
};

/**
 * Normalizes a projected asset. An unset alt stays empty (decorative): every image on the site
 * sits next to a title that already names it.
 */
export const toSanityImage = (asset: SanityImageAsset | null): ISanityImage | undefined =>
  asset
    ? {
        url: asset.url,
        alt: asset.altText ?? "",
        blurDataURL: asset.lqip ?? undefined,
        width: asset.width ?? undefined,
        height: asset.height ?? undefined,
      }
    : undefined;
