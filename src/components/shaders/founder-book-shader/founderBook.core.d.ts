export interface FounderBookOptions {
  /** Scroll distance in CSS px that swings the cover from closed to fully open. Default `480`. */
  scrollDistance: number;
  /** Fires when the book finishes opening or starts closing. */
  onOpenChange: ((open: boolean) => void) | null;
}

export interface FounderBookHandle {
  /** Whether the cover is fully open. */
  readonly isOpen: boolean;
  /** Patch options live. */
  setOptions(next: Partial<FounderBookOptions>): void;
  /** Stop the loop, drop listeners and observers. */
  destroy(): void;
}

export declare const FOUNDER_BOOK_DEFAULTS: FounderBookOptions;

/** Wire scroll-driven opening and scrap dragging into markup rendered by `FounderBookShader`. */
export declare function createFounderBook(
  host: HTMLElement,
  options?: Partial<FounderBookOptions>,
): FounderBookHandle;
