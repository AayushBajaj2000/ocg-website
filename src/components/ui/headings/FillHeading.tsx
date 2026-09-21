"use client";

import { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";
import FillText, { SPRING, toWords } from "@/components/ui/animations/FillText";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  progress?: MotionValue<number>;
  offset?: number;
  total?: number;
};

const FillHeading: React.FC<Props> = ({ text, className, progress, offset = 0, total }) => {
  const targetRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start 0.8", "end 0.5"] });
  const smoothProgress = useSpring(scrollYProgress, SPRING);
  const ownProgress = shouldReduceMotion ? scrollYProgress : smoothProgress;
  const words = toWords(text);

  return (
    <LazyMotion features={domAnimation}>
      <h2
        ref={targetRef}
        className={cn("md:text-hero-mobile font-switzer text-xl tracking-[-2%]", className)}
      >
        <span className="sr-only">{text}</span>
        <FillText
          words={words}
          offset={offset}
          total={total ?? words.length}
          progress={progress ?? ownProgress}
        />
      </h2>
    </LazyMotion>
  );
};

export default FillHeading;
