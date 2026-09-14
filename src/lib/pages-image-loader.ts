"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Image loader for the GitHub Pages static export (see next.config.ts).
 *
 * Pages has no image optimization server, and `next/image` does not add `basePath` to
 * `src`, so root-relative paths like "/logo.svg" would 404 under /<repo>/. This serves
 * the original file with the basePath prefixed. `w` is ignored by Pages; it's there so
 * each srcset entry stays distinct and Next doesn't warn that the loader ignores width.
 */
export default function pagesImageLoader({ src, width }: ImageLoaderProps): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const isRootRelative = src.startsWith("/") && !src.startsWith("//");
  return `${isRootRelative ? basePath : ""}${src}?w=${width}`;
}
