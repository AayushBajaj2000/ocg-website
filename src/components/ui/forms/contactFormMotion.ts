import type { Transition, Variants } from "motion/react";

export const CONTACT_EASE = [0.83, 0, 0.17, 1] as const;

export const SLIDE_DISTANCE = 32;

const enterTransition: Transition = { duration: 0.4, ease: CONTACT_EASE };

const exitTransition: Transition = { duration: 0.25, ease: CONTACT_EASE };

const reducedEnterTransition: Transition = { duration: 0.2, ease: "linear" };

const reducedExitTransition: Transition = { duration: 0.15, ease: "linear" };

export const reducedTransition: Transition = { duration: 0.2, ease: "linear" };

export const heightTransition: Transition = { duration: 0.4, ease: CONTACT_EASE };

export const progressTransition: Transition = { duration: 0.5, ease: CONTACT_EASE };

export const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction * SLIDE_DISTANCE, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: enterTransition },
  exit: (direction: number) => ({
    x: direction * -SLIDE_DISTANCE,
    opacity: 0,
    transition: exitTransition,
  }),
};

export const fadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: reducedEnterTransition },
  exit: { opacity: 0, transition: reducedExitTransition },
};
