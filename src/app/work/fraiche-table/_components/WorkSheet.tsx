"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
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
import Lucy from "@/app/work/fraiche-table/_components/Lucy";
import Migration from "@/app/work/fraiche-table/_components/Migration";
import Squeeze from "@/app/work/fraiche-table/_components/Squeeze";
import { MenuOpenIcon } from "@/components/icons";
import Section from "@/components/layout/sections/Section";
import { useScrollLock } from "@/components/ui/hooks/useScrollLock";
import { cn } from "@/lib/utils";

export const WORK_SHEET_TABS = ["The Migration", "Squeeze", "Lucy"];

const TAB_CONTENT: Record<string, React.FC> = {
  "The Migration": Migration,
  Squeeze,
  Lucy,
};

type Props = {
  activeTab: string | null;
  onTabChange: (tab: string) => void;
  onClose: () => void;
};

const EASE = [0.32, 0.72, 0, 1] as const;
const DISMISS_OFFSET = 140;
const DISMISS_VELOCITY = 600;
const SNAP_OFFSET = 60;
const EXPAND_QUERY = "(min-width: 768px)";

const subscribeToExpandQuery = (onChange: () => void) => {
  const query = window.matchMedia(EXPAND_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getCanExpand = () => window.matchMedia(EXPAND_QUERY).matches;

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const TabContent = activeTab ? TAB_CONTENT[activeTab] : null;
  const activeIndex = activeTab ? WORK_SHEET_TABS.indexOf(activeTab) : -1;

  const [expanded, setExpanded] = useState(false);
  const canExpand = useSyncExternalStore(subscribeToExpandQuery, getCanExpand, () => false);

  const close = useCallback(() => {
    setExpanded(false);
    onClose();
  }, [onClose]);

  useScrollLock(open);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const last = WORK_SHEET_TABS.length - 1;
    const targets: Record<string, number> = {
      ArrowLeft: activeIndex <= 0 ? last : activeIndex - 1,
      ArrowRight: activeIndex >= last ? 0 : activeIndex + 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;

    event.preventDefault();
    onTabChange(WORK_SHEET_TABS[target]);
    tabRefs.current[target]?.focus();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;

    if (offset.y < -SNAP_OFFSET || velocity.y < -DISMISS_VELOCITY) {
      if (canExpand) setExpanded(true);
      return;
    }

    if (expanded && canExpand) {
      if (offset.y > SNAP_OFFSET || velocity.y > DISMISS_VELOCITY) setExpanded(false);
      return;
    }

    if (offset.y > DISMISS_OFFSET || velocity.y > DISMISS_VELOCITY) close();
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
              onClick={close}
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
              dragElastic={{ top: canExpand && !expanded ? 0.15 : 0, bottom: 0.45 }}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative flex h-full flex-col bg-neutral-50 transition-[height] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                expanded ? "md:h-full" : "md:h-[calc(100%-170px)]",
              )}
            >
              <Section as="div" container containerClassName="border-x">
                <div
                  onPointerDown={(event) => dragControls.start(event)}
                  className="flex shrink-0 cursor-grab touch-none justify-center py-2.5 active:cursor-grabbing"
                >
                  <span className="h-1 w-10 rounded-full bg-neutral-300" />
                </div>
              </Section>
              <m.div
                ref={scrollRef}
                variants={reduced ? contentReducedVariants : contentVariants}
                className="relative flex-1 overflow-y-auto"
              >
                <Section
                  as="div"
                  container
                  containerClassName="py-6 border-x flex items-center gap-2 justify-between"
                  className="border-b-hairline sticky top-0 z-20 border-b bg-neutral-50"
                >
                  <Section
                    as="div"
                    role="tablist"
                    aria-label="Case studies"
                    onKeyDown={handleTabKeyDown}
                    className="bg-sunken border-hairline flex border p-0.75"
                  >
                    {WORK_SHEET_TABS.map((t, i) => (
                      <button
                        key={`${t}-${i}`}
                        ref={(element) => {
                          tabRefs.current[i] = element;
                        }}
                        type="button"
                        role="tab"
                        id={`${tabsId}-tab-${i}`}
                        aria-selected={t === activeTab}
                        aria-controls={`${tabsId}-panel`}
                        tabIndex={t === activeTab ? 0 : -1}
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
                    onClick={close}
                    className="border-hairline grid size-11.5 cursor-pointer place-content-center border bg-neutral-50 outline-none focus:outline-none"
                  >
                    <MenuOpenIcon />
                  </button>
                </Section>
                {TabContent && (
                  <m.div
                    key={activeTab}
                    role="tabpanel"
                    id={`${tabsId}-panel`}
                    aria-labelledby={`${tabsId}-tab-${activeIndex}`}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <TabContent />
                  </m.div>
                )}
              </m.div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

export default WorkSheet;
