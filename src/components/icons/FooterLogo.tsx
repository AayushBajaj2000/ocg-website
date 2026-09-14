"use client";

import { memo } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";

/* ─────────────────────────────────────────────────────────────────────────────
 * Footer wordmark ("Open" + "Core")
 *
 * On first scroll into view each letter rises from below its baseline while its
 * outline is drawn (stroke pathLength 0 → 1). The fill fades in behind the stroke
 * and the stroke fades out, so the settled state matches the static artwork.
 *
 * Performance notes:
 * - Plays once (`viewport.once`), so the IntersectionObserver disconnects afterwards.
 * - `LazyMotion` + `m` ships only the DOM animation feature bundle.
 * - Letters move with transforms; the stroke draw and fades are one-off and short.
 * - Glyph data and variants are module constants, and the component is memoized,
 *   so parent re-renders never rebuild or restart the animation.
 * - Reduced motion: a plain fade with no travel or drawing.
 * ──────────────────────────────────────────────────────────────────────────── */

type Glyph = {
  /** One or more path `d` strings making up a single letter. */
  paths: readonly string[];
};

type WordmarkProps = {
  className?: string;
};

const FILL = "#EAECF0";
/** Slightly darker than the fill so the outline reads on the sunken footer background. */
const STROKE = "#D0D5DD";

const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

const DRAW_DURATION = 1.2;
const RISE_DURATION = 0.9;
const LETTER_STAGGER = 0.08;
/** Vertical travel in viewBox units (the artwork is ~130–160 units tall). */
const RISE_DISTANCE = 48;

const svgVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: LETTER_STAGGER } },
};

const glyphVariants: Variants = {
  hidden: { y: RISE_DISTANCE },
  visible: { y: 0, transition: { duration: RISE_DURATION, ease: EASE_OUT } },
};

const pathVariants: Variants = {
  hidden: { pathLength: 0, fillOpacity: 0, strokeOpacity: 1 },
  visible: {
    pathLength: 1,
    fillOpacity: 1,
    strokeOpacity: 0,
    transition: {
      pathLength: { duration: DRAW_DURATION, ease: "easeInOut" },
      fillOpacity: { duration: 0.6, delay: DRAW_DURATION * 0.55, ease: "easeOut" },
      strokeOpacity: { duration: 0.4, delay: DRAW_DURATION * 0.9, ease: "easeOut" },
    },
  },
};

const reducedGlyphVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const reducedPathVariants: Variants = { hidden: {}, visible: {} };

const VIEWPORT = { once: true, amount: 0.4 } as const;

type AnimatedWordmarkProps = WordmarkProps & {
  width: number;
  viewBox: string;
  glyphs: readonly Glyph[];
};

const AnimatedWordmark = memo(function AnimatedWordmark({
  width,
  viewBox,
  glyphs,
  className,
}: AnimatedWordmarkProps) {
  const prefersReducedMotion = useReducedMotion();
  const glyph = prefersReducedMotion ? reducedGlyphVariants : glyphVariants;
  const path = prefersReducedMotion ? reducedPathVariants : pathVariants;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.svg
        width={width}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        className={className}
        variants={svgVariants}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {glyphs.map((g, i) => (
          <m.g key={i} variants={glyph}>
            {g.paths.map((d, j) => (
              <m.path
                key={j}
                d={d}
                fillRule="evenodd"
                clipRule="evenodd"
                fill={FILL}
                stroke={STROKE}
                strokeWidth={1.5}
                strokeLinejoin="round"
                variants={path}
              />
            ))}
          </m.g>
        ))}
      </m.svg>
    </LazyMotion>
  );
});

// Letters are listed left to right so the stagger reads in reading order.
const OPEN_GLYPHS: readonly Glyph[] = [
  {
    paths: [
      "M0 66.2145C0 106.327 26.4858 132.429 69.0935 132.429C112.661 132.429 138.955 106.327 138.955 66.2145C138.955 26.1019 112.661 0 69.0935 0C26.4858 0 0 26.1019 0 66.2145ZM108.247 66.2145C108.247 94.8115 97.3067 104.792 69.0935 104.792C40.8803 104.792 30.5163 94.8115 30.5163 66.2145C30.5163 37.6175 40.8803 27.6374 69.0935 27.6374C97.3067 27.6374 108.247 37.6175 108.247 66.2145Z",
    ],
  },
  {
    paths: [
      "M151 160.702H179.789V102.164H181.132C184.395 119.054 196.679 129.993 218.942 129.993C247.923 129.993 264.045 110.609 264.045 80.0927C264.045 49.5765 247.539 30 217.982 30C195.335 30 183.052 39.7882 179.597 58.2132H177.678V31.9193H151V160.702ZM207.81 103.7C189.769 103.7 179.789 97.9419 179.789 81.4362V79.9008C179.789 62.8194 189.385 56.4858 208.002 56.4858C226.235 56.4858 234.872 62.4355 234.872 80.0927C234.872 97.558 226.235 103.7 207.81 103.7Z",
    ],
  },
  {
    paths: [
      "M324.931 130.993C292.88 130.993 271 115.256 271 81.0927C271 50.3845 292.688 31 324.356 31C355.831 31 376.751 47.5056 376.751 77.6381C376.751 80.5478 376.479 82.7768 376.164 85.3571L376.163 85.3617L376.162 85.3717C376.104 85.8503 376.044 86.3411 375.984 86.8505H297.678C298.445 101.629 305.355 107.962 323.972 107.962C341.053 107.962 347.003 103.548 347.003 95.2953V93.376H375.792V95.4872C375.792 116.407 355.448 130.993 324.931 130.993ZM323.78 53.4554C306.698 53.4554 299.405 59.2132 298.062 71.6884H349.114C348.346 59.0212 340.669 53.4554 323.78 53.4554Z",
    ],
  },
  {
    paths: [
      "M387 129.074H415.789V80.517C415.789 64.2032 422.314 56.91 440.548 56.91C458.205 56.91 464.538 63.4355 464.538 78.7896V129.074H493.327V69.1933C493.327 47.8895 480.852 31 454.558 31C429.416 31 417.9 46.3541 415.405 62.4759H413.678V32.9193H387V129.074Z",
    ],
  },
];

const CORE_GLYPHS: readonly Glyph[] = [
  {
    paths: [
      "M0 67.1742C0 107.868 26.675 134.348 69.7055 134.348C110.399 134.348 136.296 114.099 136.296 80.9984C136.296 79.3854 134.988 78.0778 133.375 78.0778H106.7C105.087 78.0778 103.779 79.3854 103.779 80.9984C103.779 98.1327 94.044 106.31 70.2896 106.31C41.6675 106.31 28.1162 96.4599 28.1162 67.4485C28.1162 38.437 41.6675 28.0379 70.2896 28.0379C94.044 28.0379 103.779 36.2156 103.779 53.3499C103.779 54.9629 105.087 56.2705 106.7 56.2705H133.375C134.988 56.2705 136.296 54.9629 136.296 53.3499C136.296 20.2496 110.205 0 69.7055 0C26.675 0 0 26.4803 0 67.1742Z",
      "M48.9592 67.172C48.9592 53.028 54.1801 48.0918 68.1343 48.0918C82.0885 48.0918 87.3095 53.028 87.3095 67.172C87.3095 81.316 82.0885 86.2521 68.1343 86.2521C54.1801 86.2521 48.9592 81.316 48.9592 67.172Z",
    ],
  },
  {
    paths: [
      "M202.891 130.993C170.071 130.993 148 111.417 148 81.0927C148 50.3846 170.071 31 202.891 31C235.71 31 257.782 50.3846 257.782 81.0927C257.782 111.417 235.71 130.993 202.891 130.993ZM202.891 105.467C222.276 105.467 229.185 97.9823 229.185 81.0927C229.185 64.2032 222.276 56.3343 202.891 56.3343C183.314 56.3343 176.597 64.2032 176.597 81.0927C176.597 97.9823 183.314 105.467 202.891 105.467Z",
    ],
  },
  {
    paths: [
      "M295.789 129.074H267V32.9193H293.678V58.4454H295.405C298.092 42.8994 308.264 31 327.649 31C349.145 31 357.973 45.7783 357.973 64.5871V80.517H329.184V70.5368C329.184 59.9809 324.962 55.3746 313.254 55.3746C300.395 55.3746 295.789 61.3243 295.789 73.4157V129.074Z",
    ],
  },
  {
    paths: [
      "M417.931 129.993C385.88 129.993 364 114.256 364 80.0927C364 49.3845 385.688 30 417.356 30C448.831 30 469.751 46.5056 469.751 76.6381C469.751 79.5478 469.479 81.7768 469.164 84.3571L469.163 84.3617L469.162 84.3717C469.104 84.8503 469.044 85.3411 468.984 85.8505H390.678C391.445 100.629 398.355 106.962 416.972 106.962C434.053 106.962 440.003 102.548 440.003 94.2953V92.376H468.792V94.4872C468.792 115.407 448.448 129.993 417.931 129.993ZM416.78 52.4554C399.698 52.4554 392.405 58.2132 391.062 70.6884H442.114C441.346 58.0212 433.669 52.4554 416.78 52.4554Z",
    ],
  },
];

export const OpenSvg: React.FC<WordmarkProps> = ({ className }) => (
  <AnimatedWordmark width={494} viewBox="0 0 494 161" glyphs={OPEN_GLYPHS} className={className} />
);

export const CoreSvg: React.FC<WordmarkProps> = ({ className }) => (
  <AnimatedWordmark width={470} viewBox="0 0 470 135" glyphs={CORE_GLYPHS} className={className} />
);
