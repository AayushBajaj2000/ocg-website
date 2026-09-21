"use client";

import { useEffect, useRef } from "react";
import { createWallpaper } from "./wallpaper.core.js";
import type { WallpaperOptions } from "./wallpaper.core.js";

export type WallpaperShaderProps = Partial<WallpaperOptions> & {
  /** Selector for the `<img>` to animate, looked up inside the shader's parent. */
  imageSelector?: string;
};

/**
 * Brings a painted wallpaper to life: wind in the grass, drifting sky, swimming whales.
 * Render it as a sibling *after* the `<img>` it animates, inside a positioned parent
 * with the image's aspect ratio. The image stays in the DOM as the LCP element and
 * the fallback; the canvas fades in over it once the texture is uploaded.
 */
export default function WallpaperShader({
  imageSelector = "img",
  ...options
}: WallpaperShaderProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    const host = hostRef.current;
    const image = host?.parentElement?.querySelector<HTMLImageElement>(imageSelector);
    if (!host || !image) return;
    const wallpaper = createWallpaper(host, image, optionsRef.current);
    return () => wallpaper?.destroy();
  }, [imageSelector]);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
