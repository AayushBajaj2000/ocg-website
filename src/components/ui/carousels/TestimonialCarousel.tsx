"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowIcon } from "@/components/icons";
import TestimonialCard from "@/components/ui/cards/TestimonialCard";
import { cn } from "@/lib/utils";
import type { ITestimonialCard } from "@/types";

type Props = {
  testimonials: ITestimonialCard[];
  label?: string;
  className?: string;
};

const measure = (track: HTMLElement) => {
  const slide = track.firstElementChild as HTMLElement | null;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = (slide?.offsetWidth ?? 0) + gap;
  const maxScroll = track.scrollWidth - track.clientWidth;
  const steps = step ? Math.ceil(maxScroll / step - 0.01) : 0;

  return { step, maxScroll, steps };
};

const navButtonClass =
  "grid size-12 cursor-pointer place-content-center border border-neutral-200 bg-white text-brand-blue transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:bg-transparent disabled:text-neutral-400 motion-reduce:transition-none";

const TestimonialCarousel: React.FC<Props> = ({
  testimonials,
  label = "Client testimonials",
  className,
}) => {
  const trackRef = useRef<HTMLUListElement>(null);
  const trackId = useId();
  const prefersReducedMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const [total, setTotal] = useState(testimonials.length);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const sync = () => {
      const { step, maxScroll, steps } = measure(track);
      const isAtEnd = track.scrollLeft >= maxScroll - 1;

      setTotal(steps + 1);
      setActive(isAtEnd ? steps : Math.min(steps, Math.round(track.scrollLeft / step) || 0));
    };

    const observer = new ResizeObserver(sync);
    [track, ...track.children].forEach((element) => observer.observe(element));
    track.addEventListener("scroll", sync, { passive: true });

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", sync);
    };
  }, [testimonials.length]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const { step, maxScroll } = measure(track);
    track.scrollTo({
      left: Math.min(index * step, maxScroll),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  if (!testimonials.length) return null;

  const isFirst = active === 0;
  const isLast = active >= total - 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("mx-auto grid w-full max-w-256.5 gap-10 md:gap-12", className)}
    >
      <ul
        ref={trackRef}
        id={trackId}
        tabIndex={0}
        aria-label={`${label} slides`}
        className="focus-visible:outline-brand-blue flex snap-x snap-mandatory scrollbar-none gap-3 overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-2 md:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((testimonial, index) => (
          <li
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${testimonials.length}`}
            className="w-full shrink-0 snap-start sm:w-[min(31.4375rem,90%)] lg:w-[calc((100%-1.25rem)/2)]"
          >
            <TestimonialCard {...testimonial} />
          </li>
        ))}
      </ul>

      {total > 1 && (
        <div className="flex w-full items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={isFirst}
            aria-controls={trackId}
            aria-label="Previous testimonial"
            className={navButtonClass}
          >
            <ArrowIcon className="rotate-180" />
          </button>
          <span
            aria-live="polite"
            aria-atomic="true"
            className="text-black-3 font-switzer text-xl tabular-nums"
          >
            <span className="sr-only">Slide </span>
            {active + 1}
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> of </span>
            {total}
          </span>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={isLast}
            aria-controls={trackId}
            aria-label="Next testimonial"
            className={navButtonClass}
          >
            <ArrowIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;
