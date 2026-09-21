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

export interface SanityCropOptions {
  /** Width / height of the box the image fills. */
  aspectRatio: number;
  /** Hotspot centre (0–1 on each axis) the crop stays centred on. Defaults to the middle. */
  focus?: { x: number; y: number };
}

/**
 * Loader that has Sanity crop to the box's shape around the hotspot, so a portrait shown in a
 * landscape window doesn't download the rows that CSS would cut off anyway.
 */
export const sanityCropLoader =
  ({ aspectRatio, focus }: SanityCropOptions): ImageLoader =>
  ({ src, width, quality }) => {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("h", String(Math.round(width / aspectRatio)));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("fit", "crop");
    url.searchParams.set("crop", "focalpoint");
    url.searchParams.set("fp-x", String(focus?.x ?? 0.5));
    url.searchParams.set("fp-y", String(focus?.y ?? 0.5));
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
