"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PlusIcon } from "@/components/icons";
import Section from "@/components/layout/Section";
import {
  BuildingShader,
  INK_HEIGHT,
  INK_WIDTH,
  SHAPE_CAPTIONS,
} from "@/components/shaders/building-shader";
import type { ShapeLayout } from "@/components/shaders/building-shader";
import { AnimatedIconButton } from "@/components/ui/AnimatedIconButton";

const GAP = 12;
const WIDTH_RATIO = 0.82;

const BuildingSection: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const [layout, setLayout] = useState<ShapeLayout | null>(null);
  const [index, setIndex] = useState(0);

  // Fill the band between the copy and the meta row, the way the reference
  // anchors its artwork. Without this the shape is capped at 40% of the host
  // height, which leaves it undersized in a section this wide and short.
  const measure = useCallback(() => {
    const host = hostRef.current;
    const copy = copyRef.current;
    const meta = metaRef.current;
    if (!host || !copy || !meta) return;

    const bounds = host.getBoundingClientRect();
    if (!bounds.height) return;

    const copyBottom = copy.getBoundingClientRect().bottom - bounds.top;
    const metaTop = meta.getBoundingClientRect().top - bounds.top;
    const available = Math.max(1, metaTop - copyBottom - GAP * 2);

    // shapeLayout.size is the edge of the atlas slot, not of the drawn shape.
    // Dividing through the ink fractions makes the *visible* artwork land on
    // the width ratio and the band, instead of the slot's dead margin doing so.
    const size = Math.max(
      1,
      Math.min((bounds.width * WIDTH_RATIO) / INK_WIDTH, available / INK_HEIGHT),
    );

    const next = { size, centerY: copyBottom + GAP + available / 2 };
    setLayout((prev) =>
      prev && Math.abs(prev.size - next.size) < 0.5 && Math.abs(prev.centerY - next.centerY) < 0.5
        ? prev
        : next,
    );
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(measure);
    [hostRef, copyRef, metaRef].forEach((ref) => ref.current && observer.observe(ref.current));
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <Section
      container
      containerClassName="lg:h-206 h-162.5 bg-brand-blue relative isolate overflow-hidden"
    >
      <div ref={hostRef} className="relative h-full">
        <BuildingShader shapeLayout={layout} onShapeChange={setIndex} />

        <div
          ref={copyRef}
          className="relative mx-auto flex max-w-97 flex-col items-center gap-2 pt-8 text-center md:pt-16"
        >
          <h2 className="md:text-h2 text-hero-mobile font-medium tracking-[-2%] text-white">
            Tell us what you&apos;re building.
          </h2>
          <p className="max-w-90 text-sm font-medium tracking-[-2%] text-white md:text-base">
            We&apos;ll help you map the right scope, team, timeline, and next steps
          </p>
          <AnimatedIconButton
            href="#"
            label="Start your new project"
            icon={<PlusIcon className="size-4" />}
            className="text-brand-blue bg-white"
          />
        </div>

        <div
          ref={metaRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-4 flex items-center justify-between gap-6 md:bottom-7"
        >
          <span className="flex min-w-18 items-center gap-2.25 text-[11px] tracking-[0.15em] text-white tabular-nums md:min-w-25 md:gap-3.75 md:text-[13px]">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="opacity-65">/</span>
            <span className="opacity-65">{String(SHAPE_CAPTIONS.length).padStart(2, "0")}</span>
          </span>
          <span className="max-w-47.5 text-right text-[10px] leading-[1.5] tracking-[0.055em] text-white/88 md:max-w-none md:text-xs md:tracking-[0.13em]">
            {SHAPE_CAPTIONS[index]}
          </span>
        </div>
      </div>
    </Section>
  );
};

export default BuildingSection;
