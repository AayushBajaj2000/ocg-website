import type { Transition, Variants } from "motion/react";

export const DROPDOWN_EASE = [0.83, 0, 0.17, 1] as const;

export const SETTLE_SPRING: Transition = { type: "spring", visualDuration: 0.45, bounce: 0.35 };

export const CHEVRON_OPEN_ROTATION = -180;

export const dropdownItemVariants: Variants = {
  closed: { opacity: 0, y: 14, transition: { duration: 0.15, ease: "easeIn" } },
  open: {
    opacity: 1,
    y: 0,
    transition: { y: SETTLE_SPRING, opacity: { duration: 0.25, ease: "easeOut" } },
  },
};

export const dropdownItemReducedVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.1 } },
  open: { opacity: 1, transition: { duration: 0.2 } },
};
