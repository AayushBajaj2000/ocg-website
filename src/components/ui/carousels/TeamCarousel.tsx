"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FocusEvent } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import {
  SEQUENTIAL_DRAW_MS,
  SEQUENTIAL_ERASE_MS,
} from "@/components/ui/animations/SequentialDrawSvg";
import TeamCard from "@/components/ui/cards/TeamCard";
import { cn } from "@/lib/utils";
import type { ITeamCard } from "@/types";

type Props = {
  team: ITeamCard[];
  label?: string;
  className?: string;
};

/**
 * One cycle per card: slide in, trace the doodles, hold, erase them, move on.
 * `leave` is the erase; the slide starts once it has finished.
 */
type Phase = "enter" | "shown" | "leave";

type PlaybackChoice = "play" | "pause" | null;

const SLIDE_MS = 600;
const HOLD_MS = 900;

// The wrap-around card jumps from the far left to the far right. With at least
// five slides both of those spots are outside the viewport, so the jump is
// never seen. Shorter rosters are repeated to get there.
const MIN_SLIDES = 5;

/**
 * Tilt alternates by index, so the track needs an even length or the last and
 * first cards would lean the same way where the loop joins.
 */
const repeatCount = (length: number) => {
  if (!length) return 0;
  const repeats = Math.ceil(MIN_SLIDES / length);
  return (length * repeats) % 2 ? repeats + 1 : repeats;
};

const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

const isPageVisible = () => document.visibilityState === "visible";

/** Signed distance from the active slide, wrapped so it is as short as possible. */
const slideOffset = (index: number, active: number, count: number) => {
  const distance = (((index - active) % count) + count) % count;
  return distance > count / 2 ? distance - count : distance;
};

const TeamCarousel: React.FC<Props> = ({ team, label = "Team members", className }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(rootRef, { amount: 0.35 });
  const isNear = useInView(rootRef, { once: true, margin: "400px" });
  const isPageShown = useSyncExternalStore(subscribeToVisibility, isPageVisible, () => true);

  const [choice, setChoice] = useState<PlaybackChoice>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("enter");

  const slides = Array.from({ length: repeatCount(team.length) }, () => team).flat();
  const count = slides.length;
  const canRotate = team.length > 1;
  const maxOffset = Math.floor(count / 2);

  const wantsAutoplay = choice === null ? !prefersReducedMotion : choice === "play";
  const autoplay = canRotate && wantsAutoplay;
  // Hover and focus pause the rotation, unless the user explicitly pressed Play.
  const isInteracting = choice !== "play" && (isHovered || hasFocus);
  const isPlaying = autoplay && isInView && isPageShown && !isInteracting;

  // A pause during the erase draws the doodles back in rather than leaving
  // the card half-erased while it waits.
  const isDrawn = phase === "shown" || (phase === "leave" && !isPlaying);

  useEffect(() => {
    const motion = prefersReducedMotion ? 0 : 1;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (phase === "enter" && isInView) {
      timer = setTimeout(() => setPhase("shown"), SLIDE_MS * motion);
    } else if (phase === "shown" && isPlaying) {
      timer = setTimeout(() => setPhase("leave"), SEQUENTIAL_DRAW_MS * motion + HOLD_MS);
    } else if (phase === "leave" && isPlaying) {
      timer = setTimeout(() => {
        setActive((current) => (current + 1) % count);
        setPhase("enter");
      }, SEQUENTIAL_ERASE_MS * motion);
    }

    return () => clearTimeout(timer);
  }, [phase, isPlaying, isInView, count, prefersReducedMotion]);

  const onHover = (hovered: boolean) => (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") setIsHovered(hovered);
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
  };

  if (!count) return null;

  const current = team[active % team.length];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={onHover(true)}
      onPointerLeave={onHover(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={onBlur}
      className={cn(
        "group relative min-h-90 w-full overflow-hidden [--step:16rem] md:min-h-150 md:[--step:24rem]",
        className,
      )}
    >
      <div className="absolute inset-0">
        {slides.map((member, index) => {
          const offset = slideOffset(index, active, count);
          const isActive = offset === 0;

          return (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(index % team.length) + 1} of ${team.length}`}
              aria-hidden={!isActive}
              inert={!isActive}
              style={{ translate: `calc(-50% + var(--step) * ${offset}) -50%` }}
              className={cn(
                "absolute top-1/2 left-1/2 transition-[translate] duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-[translate] motion-reduce:transition-none",
                offset === maxOffset && "transition-none",
              )}
            >
              <TeamCard
                {...member}
                tilt={index % 2 ? "left" : "right"}
                isActive={isActive}
                drawn={isActive && isDrawn}
                loadDoodles={isNear && Math.abs(offset) <= 1}
              />
            </div>
          );
        })}
      </div>

      {/* Announces the member only while the carousel is still, so it never talks over the user. */}
      <p aria-live={isPlaying ? "off" : "polite"} aria-atomic="true" className="sr-only">
        {`${current.name}, ${current.role}. Slide ${(active % team.length) + 1} of ${team.length}.`}
      </p>

      {canRotate && (
        <button
          type="button"
          onClick={() => setChoice(autoplay ? "pause" : "play")}
          aria-label={`${autoplay ? "Pause" : "Play"} team carousel`}
          // Shown on hover and to keyboard focus only; touch screens never see it.
          className="border-hairline focus-visible:outline-brand-blue absolute right-3 bottom-3 z-20 grid size-10 cursor-pointer place-items-center border bg-white text-neutral-900 opacity-0 transition-[opacity,background-color] duration-300 group-hover:opacity-100 hover:bg-neutral-50 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
        >
          {autoplay ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
        </button>
      )}
    </div>
  );
};

export default TeamCarousel;
