"use client";

import { useRef, type ElementType } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
  type Variants,
} from "motion/react";

import { useLineSplit } from "@/components/ui/hooks/useTextLines";
import { cn } from "@/lib/utils";

type MotionTag = keyof typeof m & keyof HTMLElementTagNameMap;

type RevealProps<T extends MotionTag> = HTMLMotionProps<T> & {
  as?: T;
  distance?: number | string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: "some" | "all" | number;
  transition?: Transition;
  byLine?: boolean;
  lineStagger?: number;
};

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];

export function Reveal<T extends MotionTag = "div">({
  as,
  distance = "1.5rem",
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
  transition,
  variants,
  viewport,
  byLine = false,
  lineStagger = 0.08,
  className,
  children,
  ...rest
}: RevealProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  const probeRef = useRef<HTMLSpanElement>(null);
  const Component = m[(as ?? "div") as MotionTag] as ElementType;

  const text = typeof children === "string" ? children : "";
  const splitting = byLine && text.length > 0;
  const lines = useLineSplit(probeRef, text, splitting && !shouldReduceMotion);

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        delay,
        ease: EASE,
        ...transition,
      },
    },
  };

  const lineListVariants: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: lineStagger } },
  };

  const lineVariants: Variants = {
    hidden: { y: shouldReduceMotion ? "0%" : "110%" },
    visible: {
      y: "0%",
      transition: { duration: shouldReduceMotion ? 0 : duration, ease: EASE, ...transition },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <Component
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount, ...viewport }}
        variants={variants ?? (splitting ? lineListVariants : defaultVariants)}
        className={cn(splitting && "relative", className)}
        {...rest}
      >
        {splitting ? (
          <>
            <span
              ref={probeRef}
              aria-hidden={lines !== null}
              className={cn("block", lines && "invisible")}
            >
              {text}
            </span>
            {lines && (
              <span className="absolute inset-0 block">
                {lines.map((line, index) => (
                  <span key={index} className="block overflow-hidden">
                    <m.span className="block" variants={lineVariants}>
                      {line}
                    </m.span>
                  </span>
                ))}
              </span>
            )}
          </>
        ) : (
          children
        )}
      </Component>
    </LazyMotion>
  );
}

export default Reveal;
