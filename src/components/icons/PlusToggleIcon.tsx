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

const [CENTER_X, CENTER_Y] = COLUMN[2];

const SPRING: Transition = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 };

type Props = {
  isOpen: boolean;
  className?: string;
};

export const PlusToggleIcon: React.FC<Props> = ({ isOpen, className }) => {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : SPRING;

  return (
    <LazyMotion features={domAnimation}>
      <m.svg
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        initial={false}
        animate={{ rotate: isOpen ? -90 : 0 }}
        transition={transition}
      >
        {COLUMN.map(([x, y], index) => (
          <rect key={`column-${index}`} x={x} y={y} {...MARK} />
        ))}

        {ROW.map(([x, y], index) => (
          <m.rect
            key={`row-${index}`}
            {...MARK}
            initial={false}
            animate={{
              attrX: isOpen ? CENTER_X : x,
              attrY: isOpen ? CENTER_Y : y,
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ ...transition, delay: prefersReducedMotion ? 0 : index * 0.03 }}
          />
        ))}
      </m.svg>
    </LazyMotion>
  );
};
