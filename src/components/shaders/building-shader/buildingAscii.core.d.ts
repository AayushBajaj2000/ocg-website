export interface ShapeLayout {
  /** Artwork edge length in CSS px. */
  size: number;
  /** Artwork centre, measured in CSS px down from the host's top edge. */
  centerY: number;
}

export interface BuildingAsciiOptions {
  /** Glyph colour, six-digit hex. Default `#ffffff`. */
  ink: string;
  /** Grid cell size in CSS px, clamped 5–18. Lower is denser. Default `7`. */
  cellSize: number;
  /** Cycle the four shapes on a timer. Default `true`. */
  autoplay: boolean;
  /** Milliseconds between shapes. Default `1800`. */
  interval: number;
  /** Pointer-driven shape changes. Off by default — the timer drives it. */
  interactive: boolean;
  /** Device-pixel-ratio ceiling for the canvas. Default `2`. */
  maxDpr: number;
  /** Pin the artwork's size and centre. `null` derives both from the host box. */
  shapeLayout: ShapeLayout | null;
  /** Fires with the active shape index whenever it changes. */
  onShapeChange: ((index: number) => void) | null;
}

export interface BuildingAsciiHandle {
  /** Index of the shape currently showing, 0–3. */
  readonly index: number;
  /** Show a shape, morphing from the current one. */
  reveal(index: number): void;
  /** Fade the artwork back out to the ambient dot field. */
  rest(): void;
  /** Patch options live. Cheap — no GL teardown. */
  setOptions(next: Partial<BuildingAsciiOptions>): void;
  /** Stop the loop and timer, drop listeners, release the GL context, remove the DOM. */
  destroy(): void;
}

export declare const BUILDING_ASCII_DEFAULTS: BuildingAsciiOptions;

/** Caption copy for each shape, in index order. */
export declare const SHAPE_CAPTIONS: readonly string[];

/**
 * Mount a BuildingAscii into `host`. `host` must be positioned (the canvas is
 * absolutely placed inside it) and should have a size.
 */
export declare function createBuildingAscii(
  host: HTMLElement,
  options?: Partial<BuildingAsciiOptions>,
): BuildingAsciiHandle;

export declare const VERTEX: string;
export declare const FRAGMENT: string;

/** Fraction of an atlas slot the shapes' ink covers, per axis. */
export declare const INK_WIDTH: number;
export declare const INK_HEIGHT: number;
export declare const SHAPE_COUNT: number;
