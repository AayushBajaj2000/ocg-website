"use client";

import { useAssistant } from "@/components/assistant/AssistantProvider";
import { SparkleIcon } from "@/components/icons";
import { ASSISTANT } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The floating "Ask AI" button, bottom-right on every page (the cookie banner owns bottom-left).
 * It sits above the full-screen OS desktop so the assistant is reachable from there too, and
 * steps aside while the panel is open.
 */
const AssistantLauncher: React.FC = () => {
  const { isOpen, open } = useAssistant();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={ASSISTANT.launcherLabel}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      tabIndex={isOpen ? -1 : 0}
      className={cn(
        "assistant-launcher group bg-brand-blue focus-visible:outline-brand-blue fixed right-4 bottom-4 z-1050 flex h-12 cursor-pointer items-center text-white shadow-[0_8px_30px_rgb(32_104_204/0.35)] transition duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none md:right-6 md:bottom-6",
        isOpen ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100",
      )}
    >
      <span className="grid size-12 shrink-0 place-items-center">
        <SparkleIcon className="size-5 transition-transform duration-500 group-hover:rotate-90 motion-reduce:transition-none" />
      </span>
      {/* The label slides out on hover / keyboard focus; touch screens get the icon alone. */}
      <span
        aria-hidden
        className="grid grid-cols-[0fr] text-sm font-medium transition-[grid-template-columns] duration-300 ease-out group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr] motion-reduce:transition-none"
      >
        <span className="overflow-hidden whitespace-nowrap">
          <span className="block pr-4">{ASSISTANT.launcherLabel}</span>
        </span>
      </span>
    </button>
  );
};

export default AssistantLauncher;
