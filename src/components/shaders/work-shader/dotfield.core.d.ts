export interface DotFieldOptions {
  /** Resting dot colour. Default `#D0D5DD` (Neutral/300). */
  dotColor: string;
  /** Colour the dots and the detection overlay take near the pointer. Default `#2068CC` (Brand/Blue). */
  accentColor: string;
  /** Smear amount, 0–1. Drives how large the rectangular blocks get. Default `0.61`. */
  block: number;
  /** Dither scale. Lower is coarser: `0.5` gives 2px dots, `1.0` gives 1px. Default `0.5`. */
  scale: number;
  /** Coverage ceiling, 0–1. How much of the area fills with dots. Default `0.5`. */
  density: number;
  /** Opacity ceiling, 0–1. Default `0.36`. */
  intensity: number;
  /** Pointer falloff radius in CSS px. Default `220`. */
  hoverRadius: number;
  /** Drift multiplier. `0` freezes the field. Default `1`. */
  speed: number;
  /** Feather the pattern out at the edges of the box. Default `true`. */
  fadeEdges: boolean;
  /** Set `false` for a purely ambient field with no pointer response. Default `true`. */
  interactive: boolean;
  /** Show the detection-box overlay on hover. Default `true`. */
  tracking: boolean;
  /** Frame budget for the drift. An ambient field reads fine well under 60. Default `30`. */
  maxFps: number;
  /** Device-pixel-ratio ceiling for the canvas. The dither is 1-bit. Default `1.5`. */
  maxDpr: number;
  /** How many detection boxes, 0–6. Default `3`. */
}

export interface DotFieldHandle {
  /** Patch options live. Cheap — no GL teardown. */
  setOptions(next: Partial<DotFieldOptions>): void;
  /** Stop the loop, drop listeners, release the GL context, remove the DOM. */
  destroy(): void;
}

export declare const DOTFIELD_DEFAULTS: DotFieldOptions;

/**
 * Mount a DotField into `host`. `host` must be positioned (the canvas and the
 * SVG overlay are absolutely placed inside it) and should have a size.
 */
export declare function createDotField(
  host: HTMLElement,
  options?: Partial<DotFieldOptions>,
): DotFieldHandle;

export declare const VERT: string;
export declare const FRAG: string;
