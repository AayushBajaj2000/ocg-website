import type { PortableTextBlock } from "@/types/portableText";
import type { ISanityImage, SanityImageAsset } from "@/types/sanity";

export interface IResource {
  id: string;
  slug: string;
  title: string;
  description: string;
  category?: string;
  subCategory?: string;
  downloadUrl?: string;
  license?: string;
  overview: PortableTextBlock[];
  image?: ISanityImage;
  preview?: ISanityImage;
}

/** Raw shape returned by `RESOURCES_QUERY`, before normalization. */
export interface SanityResource {
  id: string;
  slug: string;
  title: string | null;
  description: string | null;
  category: string | null;
  subCategory: string | null;
  downloadUrl: string | null;
  license: string | null;
  overview: PortableTextBlock[];
  image: SanityImageAsset | null;
  preview: SanityImageAsset | null;
}
