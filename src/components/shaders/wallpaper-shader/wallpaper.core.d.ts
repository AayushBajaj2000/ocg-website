export interface WallpaperOptions {
  /** Displacement multiplier. `0` leaves the painting untouched. Default `1`. */
  strength: number;
  /** Time multiplier for every motion. Default `1`. */
  speed: number;
  /** Frame budget. The motion is slow enough to read well under 60. Default `30`. */
  maxFps: number;
  /** Device-pixel-ratio ceiling for the canvas. Default `1.5`. */
  maxDpr: number;
}

export interface WallpaperHandle {
  /** Patch options live. */
  setOptions(next: Partial<WallpaperOptions>): void;
  /** Stop the loop, drop listeners, release the GL context, remove the canvas. */
  destroy(): void;
}

export declare const WALLPAPER_DEFAULTS: WallpaperOptions;

/**
 * Mount an animated copy of `image` into `host`, which must be positioned and share the
 * image's aspect ratio. Returns `null` (leaving the plain image in place) under reduced
 * motion, without WebGL, or on a software renderer.
 */
export declare function createWallpaper(
  host: HTMLElement,
  image: HTMLImageElement,
  options?: Partial<WallpaperOptions>,
): WallpaperHandle | null;
