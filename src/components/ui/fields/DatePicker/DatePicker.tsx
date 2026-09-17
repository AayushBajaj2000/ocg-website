"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { ChevronIcon } from "@/components/icons";
import CalendarPanel from "@/components/ui/fields/DatePicker/CalendarPanel";
import { useAnchoredPosition } from "@/components/ui/fields/DatePicker/useAnchoredPosition";
import {
  clampDate,
  formatDisplayDate,
  isAfterDay,
  isBeforeDay,
  startOfDay,
  startOfMonth,
  toISODate,
} from "@/components/ui/fields/DatePicker/dateUtils";
import { RequiredMark } from "@/components/ui/fields/RequiredMark";
import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  locale?: string;
  weekStartsOn?: number;
  formatValue?: (date: Date, locale: string) => string;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
};

const EASE = [0.83, 0, 0.17, 1] as const;

const DatePicker: React.FC<Props> = ({
  label,
  error,
  placeholder = "Select from below",
  value,
  defaultValue = null,
  onChange,
  minDate,
  maxDate,
  isDateDisabled,
  locale = "en-GB",
  weekStartsOn = 1,
  formatValue = formatDisplayDate,
  name,
  id,
  required,
  disabled,
  clearable = true,
  className,
  labelClassName,
  triggerClassName,
}) => {
  const generatedId = useId();
  const fieldId = id ?? name ?? generatedId;
  const labelId = `${fieldId}-label`;
  const monthLabelId = `${fieldId}-month`;
  const errorId = `${fieldId}-error`;

  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue);
  const selectedDate = value !== undefined ? value : internalValue;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isInstantClose, setIsInstantClose] = useState<boolean>(false);
  const [month, setMonth] = useState<Date>(() =>
    startOfMonth(selectedDate ?? clampDate(new Date(), minDate, maxDate)),
  );
  const [focusedDate, setFocusedDate] = useState<Date>(() =>
    selectedDate ? startOfDay(selectedDate) : clampDate(new Date(), minDate, maxDate),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const position = useAnchoredPosition({ isOpen, anchorRef: triggerRef, panelRef });

  const isDisabled = (date: Date) => {
    if (minDate && isBeforeDay(date, minDate)) return true;
    if (maxDate && isAfterDay(date, maxDate)) return true;
    return isDateDisabled?.(date) ?? false;
  };

  const close = (returnFocus = true) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const open = () => {
    const next = selectedDate ? startOfDay(selectedDate) : clampDate(new Date(), minDate, maxDate);
    setFocusedDate(next);
    setMonth(startOfMonth(next));
    setIsInstantClose(false);
    setIsOpen(true);
  };

  const commit = (date: Date | null) => {
    if (value === undefined) setInternalValue(date);
    onChange?.(date);
  };

  const select = (date: Date) => {
    if (isDisabled(date)) return;
    commit(startOfDay(date));
    setFocusedDate(startOfDay(date));
    close();
  };

  useEffect(() => {
    if (!isOpen) return;

    const isInside = (target: Node | null) =>
      containerRef.current?.contains(target) || panelRef.current?.contains(target);

    const onPointerDown = (event: PointerEvent) => {
      if (!isInside(event.target as Node)) setIsOpen(false);
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!isInside(event.target as Node)) setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      event.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    const onScroll = (event: Event) => {
      if (panelRef.current?.contains(event.target as Node)) return;

      setIsInstantClose(true);
      setIsOpen(false);
      if (panelRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus({ preventScroll: true });
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [isOpen]);

  return (
    <LazyMotion features={domAnimation}>
      <div className={cn("flex w-full flex-col gap-4", className)}>
        {label && (
          <span
            id={labelId}
            className={cn(
              "font-switzer text-sm tracking-[-2%] text-black md:text-xl",
              labelClassName,
            )}
          >
            {label}
            {required && <RequiredMark />}
          </span>
        )}

        <div ref={containerRef} className="relative">
          <button
            type="button"
            ref={triggerRef}
            id={fieldId}
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-labelledby={label ? `${labelId} ${fieldId}` : undefined}
            aria-describedby={error ? errorId : undefined}
            onClick={() => (isOpen ? close(false) : open())}
            className={cn(
              "border-field-border outline-brand-blue focus-visible:outline-brand-blue font-switzer flex h-12 w-full cursor-pointer items-center justify-between gap-2 border px-4 text-base transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
              selectedDate ? "text-black-1" : "text-neutral-400",
              error && "border-red-600",
              triggerClassName,
            )}
          >
            {selectedDate ? formatValue(selectedDate, locale) : placeholder}
            <m.span
              aria-hidden="true"
              className="text-neutral-400"
              initial={false}
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: EASE }}
            >
              <ChevronIcon className="size-3" />
            </m.span>
          </button>

          {typeof document !== "undefined" &&
            createPortal(
              <AnimatePresence>
                {isOpen && (
                  <m.div
                    key="calendar"
                    ref={panelRef}
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby={monthLabelId}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion || isInstantClose
                        ? { opacity: 0 }
                        : { opacity: 0, y: -8 }
                    }
                    transition={{
                      duration: prefersReducedMotion || isInstantClose ? 0 : 0.25,
                      ease: EASE,
                    }}
                    style={{
                      top: position?.top ?? 0,
                      left: position?.left ?? 0,
                      width: position?.width,
                      maxHeight: position?.maxHeight,
                      visibility: position ? "visible" : "hidden",
                    }}
                    className="fixed z-50 overflow-y-auto"
                  >
                    <CalendarPanel
                      month={month}
                      focusedDate={focusedDate}
                      selectedDate={selectedDate}
                      locale={locale}
                      weekStartsOn={weekStartsOn}
                      labelledBy={monthLabelId}
                      isDisabled={isDisabled}
                      onMonthChange={setMonth}
                      onFocusedDateChange={setFocusedDate}
                      onSelect={select}
                      onClear={
                        clearable
                          ? () => {
                              commit(null);
                              close();
                            }
                          : undefined
                      }
                    />
                  </m.div>
                )}
              </AnimatePresence>,
              document.body,
            )}
        </div>

        {error && (
          <p id={errorId} role="alert" className="font-switzer -mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {name && (
          <input
            type="hidden"
            name={name}
            required={required}
            value={selectedDate ? toISODate(selectedDate) : ""}
          />
        )}
      </div>
    </LazyMotion>
  );
};

export default DatePicker;
