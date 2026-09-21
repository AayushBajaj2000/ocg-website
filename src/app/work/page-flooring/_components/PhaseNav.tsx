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
  /** Background behind the phases and the pinned tab bar. */
  className?: string;
  /** `solid` fills the active tab black; `outlined` lifts it onto a white, orange-bordered card. */
  variant?: Variant;
};

type Variant = "solid" | "outlined";

const STYLES: Record<
  Variant,
  { bar: string; list: string; tab: string; active: string; inactive: string }
> = {
  solid: {
    bar: "h-22 sm:h-25",
    list: "h-full rounded-lg bg-white p-2",
    tab: "h-full flex-1 rounded-lg px-6 text-base font-bold tracking-[-2%] sm:px-14 md:text-lg",
    active: "bg-black text-white",
    inactive: "text-black-1 hover:bg-neutral-100",
  },
  outlined: {
    bar: "",
    list: "w-full max-w-122 gap-2.5 rounded-2xl border border-[#a6a6a6]/20 bg-neutral-50 p-2 shadow-[0_0.25rem_1.6875rem_0_rgba(0,0,0,0.08)] sm:w-auto",
    tab: "h-14 flex-1 rounded-lg border px-4 text-base tracking-[-1%] sm:h-18 sm:w-57.5 sm:flex-none sm:text-xl/7.5",
    active: "border-anesthesia-orange bg-white text-black",
    inactive: "border-transparent text-neutral-500 hover:text-black",
  },
};

/**
 * Switches between case-study phases with a tab bar pinned to the bottom of the
 * viewport. The bar is `sticky` inside the phase wrapper, so it rides up with
 * the last section of the active phase instead of covering the footer.
 */
const PhaseNav: React.FC<Props> = ({
  phases,
  label,
  className = "bg-neutral-50",
  variant = "solid",
}) => {
  const styles = STYLES[variant];
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
    <div className={className}>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active.id}`}>
        {active.content}
      </div>

      <div
        className={cn(
          "sticky bottom-0 z-99 flex items-center justify-center px-4 py-4 backdrop-blur-xs",
          styles.bar,
        )}
      >
        <div
          role="tablist"
          aria-label={label}
          onKeyDown={onKeyDown}
          className={cn("flex", styles.list)}
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
                  "font-switzer focus-visible:outline-brand-blue cursor-pointer whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
                  styles.tab,
                  isActive ? styles.active : styles.inactive,
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
