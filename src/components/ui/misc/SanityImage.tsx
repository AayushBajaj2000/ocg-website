"use client";

import Image, { type ImageProps } from "next/image";
import { sanityCropLoader, sanityImageLoader, type SanityCropOptions } from "@/lib/sanity/image";

type Props = Omit<ImageProps, "loader"> & {
  /** Crop on Sanity's side to this shape instead of only resizing. */
  crop?: SanityCropOptions;
};

/**
 * `next/image` for a Sanity CDN url. Loaders are functions, which a Server Component can't hand to
 * `next/image` across the client boundary, so this picks the loader on the client from plain props.
 */
const SanityImage: React.FC<Props> = ({ crop, alt, ...props }) => (
  <Image {...props} alt={alt} loader={crop ? sanityCropLoader(crop) : sanityImageLoader} />
);

export default SanityImage;
