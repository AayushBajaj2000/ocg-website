"use client";

import { cn } from "@/lib/utils";
import { useId, useRef, useState } from "react";

type Phase = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  phases: readonly Phase[];
  label: string;
};

/**
 * Switches between case-study phases with a tab bar pinned to the bottom of the
 * viewport. The bar is `sticky` inside the phase wrapper, so it rides up with
 * the last section of the active phase instead of covering the footer.
 */
const PhaseNav: React.FC<Props> = ({ phases, label }) => {
  const [activeId, setActiveId] = useState(phases[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const activeIndex = Math.max(
    0,
    phases.findIndex((phase) => phase.id === activeId),
  );
  const active = phases[activeIndex];

  const select = (index: number) => {
    const phase = phases[index];
    if (!phase || phase.id === activeId) return;
    setActiveId(phase.id);
    // The new phase starts from its hero, not wherever the old one was scrolled to.
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: phases.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + phases.length) % phases.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  if (!active) return null;

  return (
    <div className="bg-neutral-50">
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active.id}`}>
        {active.content}
      </div>

      <div className="sticky bottom-0 z-99 flex h-22 items-center justify-center px-4 py-4 backdrop-blur-xs sm:h-25">
        <div
          role="tablist"
          aria-label={label}
          onKeyDown={onKeyDown}
          className="flex h-full rounded-lg bg-white p-2"
        >
          {phases.map((phase, i) => {
            const isActive = phase.id === active.id;
            return (
              <button
                key={phase.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${phase.id}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(i)}
                className={cn(
                  "font-switzer focus-visible:outline-brand-blue h-full flex-1 cursor-pointer rounded-lg px-6 text-base font-bold tracking-[-2%] whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none sm:px-14 md:text-lg",
                  isActive ? "bg-black text-white" : "text-black-1 hover:bg-neutral-100",
                )}
              >
                {phase.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhaseNav;
