import type { INavLinkCardImage } from "@/types/components";

/** Raw image asset shape returned by `SANITY_IMAGE_PROJECTION`, before normalization. */
export interface SanityImageAsset {
  url: string;
  altText: string | null;
  lqip: string | null;
  width: number | null;
  height: number | null;
}

export interface ISanityImage extends INavLinkCardImage {
  url: string;
  width?: number;
  height?: number;
}
