import type { CSSProperties, ReactNode } from "react";

type SweepTextProps = {
  children: ReactNode;
  /**
   * CSS colour the band is painted in. Omit it to pick black or white
   * automatically, whichever contrasts with the text's own colour.
   *
   * Worth setting explicitly when the text sits on a background close to that
   * automatic choice — a dark label on a white card would sweep to white and
   * read as being erased rather than recoloured.
   */
  sweepColor?: string;
  className?: string;
};

/**
 * Sweeps a band of colour across the text from left to right, once, while a
 * `.group` ancestor is hovered or focused. The band enters at the left edge and
 * leaves at the right, returning the text to its own colour.
 *
 * The whole effect is the `.text-sweep` class in globals.css — a gradient
 * clipped to the glyphs, animated by `background-position`. Nothing here
 * duplicates the text, so the accessible name stays single and correct, and
 * there is no second copy to misalign into an outline behind the band.
 */
export function SweepText({ children, sweepColor, className = "" }: SweepTextProps) {
  return (
    <span
      className={`text-sweep inline-block ${className}`}
      style={sweepColor ? ({ "--text-sweep-color": sweepColor } as CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}
