/** Shared by every desktop shortcut so files, folders and buttons line up as one grid. */
export const ICON_WRAPPER =
  "group flex w-[min(4.75rem,calc((100cqw-2rem)/3))] flex-col items-center gap-1.5 rounded-md py-1 md:w-25 md:gap-2 outline-none focus-visible:bg-white/20 focus-visible:ring-1 focus-visible:ring-white/60";

/**
 * The artwork slot above the label. Phones get smaller icons: `--icon-scale` (set on the shortcut
 * list) shrinks the artwork, and this slot shrinks with it so the rows tighten up too.
 */
export const ICON_ART = "flex h-11 items-center justify-center md:h-15";

export const ICON_LABEL =
  "rounded-xs px-1 text-center text-[10px] font-medium md:text-[11.2px] tracking-[0.01em] whitespace-nowrap text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.45)] group-hover:bg-white/20";

export const WINDOW_FOCUS_RING = "outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]";
