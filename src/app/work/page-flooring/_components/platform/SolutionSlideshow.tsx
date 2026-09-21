"use client";

import { ArrowIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useId, useRef, useState } from "react";

const SLIDES = [
  { src: "/page-flooring/platform/solution-img-1.webp", alt: "Project management kanban board" },
  { src: "/page-flooring/platform/solution-img-2.webp", alt: "Page Flooring platform screen 2" },
  { src: "/page-flooring/platform/solution-img-3.webp", alt: "Page Flooring platform screen 3" },
  { src: "/page-flooring/platform/solution-img-4.webp", alt: "Page Flooring platform screen 4" },
  { src: "/page-flooring/platform/solution-img-5.webp", alt: "Page Flooring platform screen 5" },
];

const SWIPE_THRESHOLD = 40;

const navButtonClass =
  "border-hairline text-black-3 hover:text-brand-blue focus-visible:outline-brand-blue grid size-10 shrink-0 cursor-pointer place-content-center border bg-white transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 md:size-13 motion-reduce:transition-none";

const SolutionSlideshow: React.FC = () => {
  const [active, setActive] = useState(0);
  const stageId = useId();
  const pointerStartX = useRef<number | null>(null);

  const total = SLIDES.length;
  const goTo = (index: number) => setActive(((index % total) + total) % total);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goTo(active - 1);
    if (e.key === "ArrowRight") goTo(active + 1);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    goTo(delta < 0 ? active + 1 : active - 1);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Platform screens"
      onKeyDown={onKeyDown}
      className="flex flex-col gap-4 md:gap-6.5"
    >
      <div
        id={stageId}
        aria-live="polite"
        onPointerDown={(e) => (pointerStartX.current = e.clientX)}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointerStartX.current = null)}
        className="bg-black-1 relative aspect-[2856/1370] w-full touch-pan-y overflow-hidden rounded-lg select-none md:rounded-2xl"
      >
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}`}
            aria-hidden={i !== active}
            className={cn(
              "absolute inset-0 transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,scale] motion-reduce:transition-none",
              i === active ? "scale-100 opacity-100" : "pointer-events-none scale-[1.03] opacity-0",
            )}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              draggable={false}
              priority={i === 0}
              sizes="(min-width: 1536px) 1428px, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          aria-controls={stageId}
          aria-label="Previous image"
          className={navButtonClass}
        >
          <ArrowIcon className="rotate-180" />
        </button>

        {SLIDES.map((slide, i) => {
          const isActive = i === active;
          return (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-controls={stageId}
              aria-label={`Show image ${i + 1}`}
              aria-current={isActive}
              className={cn(
                "group focus-visible:outline-brand-blue relative aspect-[108/52] max-w-27 min-w-0 flex-1 cursor-pointer overflow-hidden rounded-sm transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
                isActive
                  ? "ring-brand-blue ring-2 ring-offset-2 ring-offset-white"
                  : "ring-hairline ring-1",
              )}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="108px"
                className={cn(
                  "object-cover transition-[opacity,filter] duration-300 motion-reduce:transition-none",
                  isActive
                    ? "opacity-100 grayscale-0"
                    : "opacity-45 grayscale group-hover:opacity-80 group-hover:grayscale-0",
                )}
              />
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          aria-controls={stageId}
          aria-label="Next image"
          className={navButtonClass}
        >
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
};

export default SolutionSlideshow;
