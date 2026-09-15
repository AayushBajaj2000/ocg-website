"use client";

import { LazyMotion, domAnimation, m, useReducedMotion, type Transition } from "motion/react";

const MARK = { width: 4.675, height: 4.542 };

const COLUMN = [
  [13.459, 0],
  [13.459, 6.86471],
  [13.5269, 13.7294],
  [13.5948, 20.5936],
  [13.6628, 27.4583],
] as const;

const ROW = [
  [6.8144, 13.7291],
  [20.5103, 13.729],
  [0, 13.7291],
  [27.3247, 13.7291],
] as const;

const CENTER_INDEX = 2;

const ROTATE_DURATION = 0.5;

const FADE_DURATION = ROTATE_DURATION * 0.4;

const ROTATE: Transition = { duration: ROTATE_DURATION, ease: [0.65, 0, 0.35, 1] };

const FADE_OUT: Transition = {
  duration: FADE_DURATION,
  delay: ROTATE_DURATION - FADE_DURATION,
  ease: "easeIn",
};

const FADE_IN: Transition = { duration: FADE_DURATION, ease: "easeOut" };

const INSTANT: Transition = { duration: 0 };

type Props = {
  isOpen: boolean;
  className?: string;
};

export const PlusToggleIcon: React.FC<Props> = ({ isOpen, className }) => {
  const prefersReducedMotion = useReducedMotion();

  const rotateTransition = prefersReducedMotion ? INSTANT : ROTATE;
  const fadeTransition = prefersReducedMotion ? INSTANT : isOpen ? FADE_OUT : FADE_IN;

  return (
    <LazyMotion features={domAnimation}>
      <m.svg
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={rotateTransition}
      >
        {ROW.map(([x, y], index) => (
          <rect key={`row-${index}`} x={x} y={y} {...MARK} />
        ))}

        {COLUMN.map(([x, y], index) =>
          index === CENTER_INDEX ? (
            <rect key={`column-${index}`} x={x} y={y} {...MARK} />
          ) : (
            <m.rect
              key={`column-${index}`}
              x={x}
              y={y}
              {...MARK}
              initial={false}
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={fadeTransition}
            />
          ),
        )}
      </m.svg>
    </LazyMotion>
  );
};
