"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useReducedMotion, useScroll, useSpring, type MotionValue } from "motion/react";
import { FILL_OFFSET, SPRING } from "@/components/ui/animations/FillText";

type Props = {
  targetRef: RefObject<HTMLElement | null>;
  scrollRoot: HTMLElement | null;
  children: (progress: MotionValue<number>) => ReactNode;
};

const ScrollProgress: React.FC<Props> = ({ targetRef, scrollRoot, children }) => {
  const containerRef = useRef<HTMLElement | null>(scrollRoot);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    ...(scrollRoot ? { container: containerRef } : {}),
    offset: [...FILL_OFFSET],
  });
  const smoothProgress = useSpring(scrollYProgress, SPRING);

  return children(shouldReduceMotion ? scrollYProgress : smoothProgress);
};

export default ScrollProgress;
