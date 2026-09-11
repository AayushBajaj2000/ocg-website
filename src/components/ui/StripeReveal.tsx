"use client";

import { useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useInView,
  useReducedMotion,
  type Transition,
} from "motion/react";

import { useLineBoxes } from "@/components/ui/hooks/useTextLines";
import { cn } from "@/lib/utils";

type StripeRevealProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: ElementType;
  children: ReactNode;
  baseColor?: string;
  accentColor?: string;
  delay?: number;
  stagger?: number;
  phase?: number;
  bleed?: number;
  once?: boolean;
  amount?: number | "some" | "all";
};

const EASE: Transition["ease"] = [0.65, 0, 0.35, 1];
const TIMES = [0, 1 / 3, 2 / 3, 1];
const SLIDE_OUT = ["0%", "0%", "0%", "101%"];
const BASE_SCALE = [0, 1, 1, 1];
const ACCENT_SCALE = [0, 0, 1, 1];
const AT_REST = { scaleX: 0, x: "0%" };

export function StripeReveal({
  as,
  children,
  className,
  baseColor = "var(--color-white)",
  accentColor = "var(--color-brand-blue)",
  delay = 0,
  stagger = 0.08,
  phase = 0.35,
  bleed = 0.1,
  once = true,
  amount = 0.4,
  ...rest
}: StripeRevealProps) {
  const hostRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const Component = (as ?? "div") as ElementType;
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(hostRef, { once, amount });
  const boxes = useLineBoxes(textRef, hostRef, !shouldReduceMotion);

  const stripes = shouldReduceMotion ? [] : (boxes ?? []);
  const playing = inView && stripes.length > 0;
  const revealed = shouldReduceMotion || boxes?.length === 0 || playing;
  const sweep = phase * 3;
  const step = stripes.length > 1 ? Math.min(stagger, phase / (stripes.length - 1)) : 0;
  const coveredAt = delay + (stripes.length - 1) * step + phase;

  return (
    <LazyMotion features={domAnimation}>
      <Component ref={hostRef} className={cn("relative", className)} {...rest}>
        <m.span
          ref={textRef}
          className="block"
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 0, delay: playing ? coveredAt : 0 }}
        >
          {children}
        </m.span>

        {stripes.map((box, index) => {
          const transition = {
            duration: sweep,
            delay: delay + index * step,
            times: TIMES,
            ease: EASE,
          };

          return (
            <span
              key={index}
              aria-hidden
              className="pointer-events-none absolute overflow-hidden"
              style={{
                top: box.top,
                left: `calc(${box.left}px - ${bleed}em)`,
                width: `calc(${box.width}px + ${bleed * 2}em)`,
                height: box.height,
              }}
            >
              <m.span
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: baseColor }}
                initial={AT_REST}
                animate={playing ? { scaleX: BASE_SCALE, x: SLIDE_OUT } : AT_REST}
                transition={transition}
              />
              <m.span
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: accentColor }}
                initial={AT_REST}
                animate={playing ? { scaleX: ACCENT_SCALE, x: SLIDE_OUT } : AT_REST}
                transition={transition}
              />
            </span>
          );
        })}
      </Component>
    </LazyMotion>
  );
}

export default StripeReveal;
