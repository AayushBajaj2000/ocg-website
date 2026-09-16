"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import {
  DRAW_EASING,
  drawKeyframes,
  hideShapes,
  loadSvg,
  parseSvg,
} from "@/components/ui/animations/drawSvg";
import { cn } from "@/lib/utils";
import type { ITeamDoodle } from "@/types";

type Props = {
  doodle: ITeamDoodle;
  /** Fetch and prime the markup. Flip this on shortly before the doodle can be seen. */
  load: boolean;
  /** true traces the shapes in one after another; false erases them in reverse order. */
  drawn: boolean;
  className?: string;
};

const PATH_DURATION = 260;
const SPREAD = 520;
const ERASE_RATE = 1.6;

/** Total time for a full draw. Erasing takes this divided by ERASE_RATE. */
export const SEQUENTIAL_DRAW_MS = PATH_DURATION + SPREAD;
export const SEQUENTIAL_ERASE_MS = Math.ceil(SEQUENTIAL_DRAW_MS / ERASE_RATE);

/**
 * Rather than tracing every shape at once, this draws them in
 * document order, each starting as the previous one is underway.
 *
 * Every shape gets one animation that shares the same total length: its own
 * stagger as `delay`, the remaining stagger as `endDelay`. Playing the set
 * backwards therefore erases the last shape first, and flipping direction
 * mid-draw continues from wherever each shape currently is.
 */
const SequentialDrawSvg: React.FC<Props> = ({ doodle, load, drawn, className }) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const idPrefix = `${useId().replace(/[^\w-]/g, "")}-`;
  const shouldReduceMotion = useReducedMotion();
  const animationsRef = useRef<Animation[]>([]);
  // Bumped once the animations exist, so the direction effect runs against them.
  const [primed, setPrimed] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!load) return;
    let cancelled = false;
    let created: Animation[] = [];

    loadSvg(doodle.url)
      .then((markup) => {
        const host = hostRef.current;
        const svg = parseSvg(markup, idPrefix);
        if (cancelled || !host) return;
        if (!svg) return setFailed(true);
        host.replaceChildren(svg);
        if (shouldReduceMotion) return;

        const targets = hideShapes(svg);
        const step = SPREAD / Math.max(targets.length - 1, 1);
        created = targets.map((target, index) => {
          const animation = target.el.animate(drawKeyframes(target), {
            duration: PATH_DURATION,
            delay: index * step,
            endDelay: (targets.length - 1 - index) * step,
            easing: DRAW_EASING,
            fill: "both",
          });
          animation.pause();
          return animation;
        });
        animationsRef.current = created;
        setPrimed((count) => count + 1);
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      created.forEach((animation) => animation.cancel());
      animationsRef.current = [];
    };
  }, [load, doodle.url, idPrefix, shouldReduceMotion]);

  useEffect(() => {
    const rate = drawn ? 1 : -ERASE_RATE;

    for (const animation of animationsRef.current) {
      const time = Number(animation.currentTime ?? 0);
      const end = Number(animation.effect?.getComputedTiming().endTime ?? 0);
      animation.updatePlaybackRate(rate);
      // play() at the far edge rewinds to the opposite one, which would flash
      // the doodle in (or out) before animating it back. Stay put instead.
      if (drawn ? time >= end : time <= 0) animation.pause();
      else animation.play();
    }
  }, [drawn, primed]);

  return (
    <span
      aria-hidden="true"
      style={{ aspectRatio: `${doodle.width} / ${doodle.height}` } as CSSProperties}
      className={cn(
        "pointer-events-none absolute block text-black",
        // Without the draw, the shapes are never hidden; toggle the whole doodle instead.
        shouldReduceMotion && !drawn && "opacity-0",
        className,
      )}
    >
      <span ref={hostRef} className="block size-full" />
      {failed && (
        <Image
          src={doodle.url}
          alt=""
          fill
          sizes={`${doodle.width}px`}
          className={cn(
            "object-contain transition-opacity duration-300 motion-reduce:transition-none",
            drawn ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
};

export default SequentialDrawSvg;
