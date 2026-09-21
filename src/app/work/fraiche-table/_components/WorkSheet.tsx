"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  LazyMotion,
  domMax,
  m,
  useDragControls,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "motion/react";
import Migration from "@/app/work/fraiche-table/_components/Migration";
import { MenuOpenIcon } from "@/components/icons";
import Section from "@/components/layout/sections/Section";
import { useScrollLock } from "@/components/ui/hooks/useScrollLock";
import { cn } from "@/lib/utils";

export const WORK_SHEET_TABS = ["The Migration", "Squeeze", "Lucy"];

type Props = {
  activeTab: string | null;
  onTabChange: (tab: string) => void;
  onClose: () => void;
};

const EASE = [0.32, 0.72, 0, 1] as const;
const DISMISS_OFFSET = 140;
const DISMISS_VELOCITY = 600;

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "linear" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "linear" } },
};

const panelVariants: Variants = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: { type: "spring", visualDuration: 0.55, bounce: 0.16 } },
  exit: { y: "100%", transition: { duration: 0.32, ease: EASE } },
};

const panelReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.14, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "linear" } },
};

const contentReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const WorkSheet: React.FC<Props> = ({ activeTab, onTabChange, onClose }) => {
  const open = activeTab !== null;
  const reduced = Boolean(useReducedMotion());
  const dragControls = useDragControls();

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) onClose();
  };

  return (
    <LazyMotion features={domMax}>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-9999 flex h-dvh w-full flex-col justify-end">
            <m.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
              className="bg-black-1/45 absolute inset-0 backdrop-blur-[2px]"
            />
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Case study"
              variants={reduced ? panelReducedVariants : panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag={reduced ? false : "y"}
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.45 }}
              onDragEnd={handleDragEnd}
              className="relative flex h-[calc(100%-170px)] flex-col bg-neutral-50 shadow-[0_-24px_60px_-20px_rgba(19,19,19,0.35)]"
            >
              <div
                onPointerDown={(event) => dragControls.start(event)}
                className="flex shrink-0 cursor-grab touch-none justify-center py-2.5 active:cursor-grabbing"
              >
                <span className="h-1 w-10 rounded-full bg-neutral-300" />
              </div>
              <m.div
                variants={reduced ? contentReducedVariants : contentVariants}
                className="flex-1 overflow-y-auto"
              >
                <Section
                  as="div"
                  container
                  containerClassName="py-6 border-x flex items-center gap-2 justify-between"
                  className="border-b-hairline sticky top-0 z-20 border-b bg-neutral-50"
                >
                  <Section as="div" className="bg-sunken border-hairline flex border p-0.75">
                    {WORK_SHEET_TABS.map((t, i) => (
                      <button
                        key={`${t}-${i}`}
                        type="button"
                        className={cn(
                          "font-switzer text-black-1 cursor-pointer px-3 py-2.5 text-xs font-medium tracking-[-2%] outline-none focus:outline-none md:px-4.5 md:text-sm",
                          {
                            "bg-white": t === activeTab,
                            "bg-transparent": t !== activeTab,
                          },
                        )}
                        onClick={() => onTabChange(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </Section>
                  <button
                    type="button"
                    aria-label="Close case study"
                    onClick={onClose}
                    className="border-hairline grid size-11.5 cursor-pointer place-content-center border bg-neutral-50 outline-none focus:outline-none"
                  >
                    <MenuOpenIcon />
                  </button>
                </Section>
                <Migration />
              </m.div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default WorkSheet;
