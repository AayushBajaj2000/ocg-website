import { useId, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";

import { BulletIcon } from "@/components/icons/BulletIcon";
import { PlusToggleIcon } from "@/components/icons/PlusToggleIcon";
import { cn } from "@/lib/utils";

type Props = {
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
};

const EASE = [0.32, 0.72, 0, 1] as const;

const Accordion: React.FC<Props> = ({
  question,
  answer,
  isOpen,
  onToggle,
  defaultOpen = false,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const prefersReducedMotion = useReducedMotion();

  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : uncontrolledOpen;

  const handleToggle = () => {
    if (!isControlled) setUncontrolledOpen((value) => !value);
    onToggle?.();
  };

  const id = useId();
  const panelId = `${id}-panel`;
  const triggerId = `${id}-trigger`;
  const duration = prefersReducedMotion ? 0 : 0.42;

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn(
          "border p-4 transition-colors duration-300 ease-in-out motion-reduce:transition-none md:p-5",
          open ? "border-hairline" : "group border-hairline hover:border-brand-blue",
        )}
      >
        <button
          type="button"
          id={triggerId}
          onClick={handleToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full cursor-pointer items-start justify-between gap-2 text-left"
        >
          <span className="flex min-w-0 overflow-hidden">
            <span className="group-hover:text-brand-blue flex min-w-0 -translate-x-3.5 items-start gap-2 text-base text-black transition-[translate,color] duration-300 ease-in-out group-hover:translate-x-0 motion-reduce:transition-none md:-translate-x-5 md:gap-3 md:text-2xl">
              <span className="flex h-lh shrink-0 items-center">
                <BulletIcon className="size-1.5 md:size-2" />
              </span>
              {question}
            </span>
          </span>
          <PlusToggleIcon
            isOpen={open}
            className={cn(
              "group-hover:text-brand-blue mt-1 size-5 shrink-0 transition-colors duration-300 md:size-6",
              open ? "text-black" : "text-neutral-500",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <m.div
              key="panel"
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration, ease: EASE },
                opacity: { duration: duration * 0.7, ease: "linear" },
              }}
              className="overflow-hidden"
            >
              <m.p
                initial={{ y: prefersReducedMotion ? 0 : -6 }}
                animate={{ y: 0 }}
                exit={{ y: prefersReducedMotion ? 0 : -6 }}
                transition={{ duration, ease: EASE }}
                className="pt-2 text-xs text-black/60 md:text-base"
              >
                {answer}
              </m.p>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default Accordion;
