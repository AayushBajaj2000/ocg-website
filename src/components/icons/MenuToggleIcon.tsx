"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, type Transition } from "motion/react";

/**
 * Mark shape at each end of the morph, in a 32x32 box. Closed marks are dots —
 * a full-radius rx on a square, MenuIcon's 4.706 doubled. Open marks are the
 * cross's sharp segments, widened from PlusIcon's 4.675 to the most five marks
 * can carry across the box (4 gaps of 6.6 plus one mark fills 31.9 of 32).
 */
const CLOSED_MARK = { size: 9.412, rx: 4.706 };
const OPEN_MARK = { size: 5, rx: 0 };

/** Centre-to-centre distance out to the grid's corner dots, and to the cross's arm tips. */
const GRID_CORNER = 11.294 * Math.SQRT2;
const CROSS_TIP = 13.2;

/**
 * Turning the cross 45° puts its arm tips on the diagonal, where the box is
 * only 1/√2 as wide as it is edge to edge — which is why an unscaled X reads
 * visibly smaller than the grid. This lands the tips on the same radius as the
 * grid's corner dots, so both states fill the same square, then adds 8% on top:
 * the cross spreads its weight over five slim marks per axis against the grid's
 * three fat ones, so matching footprints exactly still reads lighter.
 */
const OPEN_SCALE = (GRID_CORNER / CROSS_TIP) * 1.08;

/**
 * MenuIcon and PlusIcon are both nine marks, so the toggle is a morph rather
 * than a swap: every dot in the grid owns one segment of the cross and travels
 * to it. Positions are centres — the mark grows around its own centre, so the
 * two shapes stay aligned at any size. The pairing is 90°-rotationally
 * symmetric (each corner takes the inner segment of the arm it turns into), so
 * the grid reads as twisting into the cross instead of scattering.
 */
const MARKS = [
  { closed: [16, 16], open: [16, 16] }, // centre — holds still
  { closed: [16, 4.706], open: [16, 2.8] }, // top
  { closed: [4.706, 16], open: [2.8, 16] }, // left
  { closed: [27.294, 16], open: [29.2, 16] }, // right
  { closed: [16, 27.294], open: [16, 29.2] }, // bottom
  { closed: [4.706, 4.706], open: [16, 9.4] }, // corners spiral into the arms
  { closed: [27.294, 4.706], open: [22.6, 16] },
  { closed: [27.294, 27.294], open: [16, 22.6] },
  { closed: [4.706, 27.294], open: [9.4, 16] },
] as const;

const SPRING: Transition = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 };

type Props = {
  isOpen: boolean;
  className?: string;
};

/**
 * The open state is the cross turned 45°, which is how the close affordance is
 * drawn in the design — the same nine marks, read as an X.
 */
export const MenuToggleIcon: React.FC<Props> = ({ isOpen, className }) => {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : SPRING;
  const { size, rx } = isOpen ? OPEN_MARK : CLOSED_MARK;

  return (
    <LazyMotion features={domAnimation}>
      <m.svg
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        animate={{ rotate: isOpen ? 45 : 0, scale: isOpen ? OPEN_SCALE : 1 }}
        transition={transition}
      >
        {MARKS.map(({ closed, open }, index) => {
          const [x, y] = isOpen ? open : closed;

          return (
            <m.rect
              key={index}
              initial={false}
              // Centre-anchored: the attribute is the top-left corner, so half
              // the mark is taken back off each axis.
              animate={{ attrX: x - size / 2, attrY: y - size / 2, width: size, height: size, rx }}
              // Ripples outwards from the centre mark, which never moves.
              transition={{ ...transition, delay: prefersReducedMotion ? 0 : index * 0.02 }}
            />
          );
        })}
      </m.svg>
    </LazyMotion>
  );
};
