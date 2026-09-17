"use client";

import { useEffect, useRef } from "react";
import { useAnimate, useReducedMotion, type Easing } from "motion/react";

/** Fills from MenuIcon (closed) and MenuOpenIcon (open). */
const IDLE = "#98A2B3";
const ACCENT = "#2068CC";
const MUTED = "#EAECF0";

/**
 * MenuIcon and MenuOpenIcon are the same 3x3 grid of 4x4 squares in a 20x20
 * box — only the fills differ. The toggle squeezes every square into the
 * centre one, swaps the colours while they're stacked, then slings them back
 * out to the other icon. Both patterns look the same after a quarter turn, so the
 * rotation always lands exactly on the design.
 */
const CENTRE = 8;
const SQUARES = [
  { x: 8, y: 8, open: ACCENT }, // centre
  { x: 0, y: 0, open: ACCENT }, // corners
  { x: 16, y: 0, open: ACCENT },
  { x: 16, y: 16, open: ACCENT },
  { x: 0, y: 16, open: ACCENT },
  { x: 8, y: 0, open: MUTED }, // edges
  { x: 16, y: 8, open: MUTED },
  { x: 8, y: 16, open: MUTED },
  { x: 0, y: 8, open: MUTED },
] as const;

const DURATION = 0.75;
/** Share of the animation spent squeezing in; the rest is the sling out. */
const SQUEEZE_AT = 0.4;
const ROTATE_EASE: Easing = [0.65, 0, 0.35, 1];
const SQUEEZE_EASE: Easing = [0.5, 0, 0.9, 0.5];
/** Overshoots past the resting spot and settles back — the slingshot. */
const SLING_EASE: Easing = [0.3, 1.8, 0.55, 1];

type Props = {
  isOpen: boolean;
  className?: string;
};

export const MenuToggleIcon: React.FC<Props> = ({ isOpen, className }) => {
  const [scope, animate] = useAnimate<SVGSVGElement>();
  const prefersReducedMotion = useReducedMotion();
  const wasOpen = useRef(isOpen);

  useEffect(() => {
    // Only animate real toggles — the first render (and Strict Mode's re-run)
    // already paints the right state from the attributes.
    if (wasOpen.current === isOpen) return;
    wasOpen.current = isOpen;

    const rects = scope.current.querySelectorAll("rect");

    if (prefersReducedMotion) {
      animate(scope.current, { rotate: 0 }, { duration: 0 });
      rects.forEach((rect, index) => {
        const fill = isOpen ? SQUARES[index].open : IDLE;
        animate(rect, { x: 0, y: 0, scale: 1, fill }, { duration: 0 });
      });
      return;
    }

    animate(scope.current, { rotate: isOpen ? 90 : 0 }, { duration: DURATION, ease: ROTATE_EASE });

    rects.forEach((rect, index) => {
      const { x, y, open } = SQUARES[index];
      const fill = isOpen ? open : IDLE;

      // `null` starts from wherever the square is, so a toggle mid-animation
      // squeezes from there instead of jumping.
      animate(
        rect,
        {
          x: [null, CENTRE - x, 0],
          y: [null, CENTRE - y, 0],
          scale: [null, 0.7, 1],
          fill: [null, fill, fill],
        },
        { duration: DURATION, times: [0, SQUEEZE_AT, 1], ease: [SQUEEZE_EASE, SLING_EASE] },
      );
    });
  }, [isOpen, prefersReducedMotion, animate, scope]);

  return (
    <svg
      ref={scope}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {SQUARES.map(({ x, y, open }, index) => (
        <rect key={index} x={x} y={y} width={4} height={4} fill={isOpen ? open : IDLE} />
      ))}
    </svg>
  );
};
