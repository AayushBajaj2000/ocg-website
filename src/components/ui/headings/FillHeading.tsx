"use client";

import { useRef } from "react";
import { LazyMotion, domAnimation, useMotionValue, type MotionValue } from "motion/react";
import FillText, { toWords } from "@/components/ui/animations/FillText";
import ScrollProgress from "@/components/ui/animations/ScrollProgress";
import { useScrollRoot } from "@/components/ui/hooks/useScrollRoot";
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
  const scrollRoot = useScrollRoot(targetRef, !progress);
  const idleProgress = useMotionValue(0);
  const words = toWords(text);
  const wordTotal = total ?? words.length;

  return (
    <LazyMotion features={domAnimation}>
      <h2
        ref={targetRef}
        className={cn("md:text-hero-mobile font-switzer text-xl tracking-[-2%]", className)}
      >
        <span className="sr-only">{text}</span>
        {progress || scrollRoot === undefined ? (
          <FillText
            words={words}
            offset={offset}
            total={wordTotal}
            progress={progress ?? idleProgress}
          />
        ) : (
          <ScrollProgress targetRef={targetRef} scrollRoot={scrollRoot}>
            {(ownProgress) => (
              <FillText words={words} offset={offset} total={wordTotal} progress={ownProgress} />
            )}
          </ScrollProgress>
        )}
      </h2>
    </LazyMotion>
  );
};

export default FillHeading;
