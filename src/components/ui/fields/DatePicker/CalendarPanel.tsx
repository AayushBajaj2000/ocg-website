"use client";

import { useEffect, useRef } from "react";
import { ChevronIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  DAYS_IN_WEEK,
  addDays,
  addMonths,
  formatFullDate,
  formatMonthLabel,
  getCalendarDays,
  getWeekdayLabels,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from "@/components/ui/fields/DatePicker/dateUtils";

type Props = {
  month: Date;
  focusedDate: Date;
  selectedDate: Date | null;
  locale: string;
  weekStartsOn: number;
  labelledBy: string;
  isDisabled: (date: Date) => boolean;
  onMonthChange: (month: Date) => void;
  onFocusedDateChange: (date: Date) => void;
  onSelect: (date: Date) => void;
  onClear?: () => void;
};

const NAV_CLASS =
  "outline-brand-blue focus-visible:outline-brand-blue grid size-8 cursor-pointer place-content-center border border-neutral-300 text-neutral-600 transition-colors duration-200 hover:border-brand-blue hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600 motion-reduce:transition-none";

const CalendarPanel: React.FC<Props> = ({
  month,
  focusedDate,
  selectedDate,
  locale,
  weekStartsOn,
  labelledBy,
  isDisabled,
  onMonthChange,
  onFocusedDateChange,
  onSelect,
  onClear,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const days = getCalendarDays(month, weekStartsOn);
  const weekdays = getWeekdayLabels(locale, weekStartsOn);
  const today = startOfDay(new Date());

  useEffect(() => {
    gridRef.current
      ?.querySelector<HTMLButtonElement>("[data-focused='true']")
      ?.focus({ preventScroll: true });
  }, [focusedDate]);

  const moveFocus = (next: Date) => {
    onFocusedDateChange(next);
    if (!isSameMonth(next, month)) onMonthChange(startOfMonth(next));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusedDate, -1),
      ArrowRight: () => addDays(focusedDate, 1),
      ArrowUp: () => addDays(focusedDate, -DAYS_IN_WEEK),
      ArrowDown: () => addDays(focusedDate, DAYS_IN_WEEK),
      Home: () =>
        addDays(
          focusedDate,
          -((focusedDate.getDay() - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK),
        ),
      End: () =>
        addDays(
          focusedDate,
          DAYS_IN_WEEK - 1 - ((focusedDate.getDay() - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK),
        ),
      PageUp: () => addMonths(focusedDate, -1),
      PageDown: () => addMonths(focusedDate, 1),
    };

    const move = moves[event.key];

    if (!move) return;

    event.preventDefault();
    moveFocus(move());
  };

  return (
    <div className="border-hairline shadow-header-dropdown w-full border bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onMonthChange(addMonths(month, -1))}
          className={NAV_CLASS}
        >
          <ChevronIcon className="size-3 rotate-90" />
        </button>

        <p
          id={labelledBy}
          aria-live="polite"
          className="font-switzer text-black-1 text-base font-medium"
        >
          {formatMonthLabel(month, locale)}
        </p>

        <button
          type="button"
          aria-label="Next month"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className={NAV_CLASS}
        >
          <ChevronIcon className="size-3 -rotate-90" />
        </button>
      </div>

      <div role="grid" aria-labelledby={labelledBy} onKeyDown={onKeyDown} ref={gridRef}>
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((weekday) => (
            <abbr
              key={weekday}
              role="columnheader"
              title={weekday}
              className="font-switzer grid h-8 place-content-center text-xs text-neutral-500 no-underline"
            >
              {weekday}
            </abbr>
          ))}
        </div>

        {Array.from({ length: days.length / DAYS_IN_WEEK }, (_, week) => (
          <div role="row" key={week} className="grid grid-cols-7">
            {days.slice(week * DAYS_IN_WEEK, week * DAYS_IN_WEEK + DAYS_IN_WEEK).map((day) => {
              const isOutside = !isSameMonth(day, month);
              const isSelected = selectedDate !== null && isSameDay(day, selectedDate);
              const isFocused = isSameDay(day, focusedDate);
              const isToday = isSameDay(day, today);
              const disabled = isDisabled(day);

              return (
                <div role="gridcell" key={day.toISOString()} aria-selected={isSelected}>
                  <button
                    type="button"
                    tabIndex={isFocused ? 0 : -1}
                    data-focused={isFocused}
                    disabled={disabled}
                    aria-label={formatFullDate(day, locale)}
                    aria-current={isToday ? "date" : undefined}
                    onClick={() => onSelect(day)}
                    className={cn(
                      "font-switzer outline-brand-blue focus-visible:outline-brand-blue relative grid size-10 cursor-pointer place-content-center border text-sm transition-colors duration-200 motion-reduce:transition-none",
                      isSelected
                        ? "border-brand-blue text-brand-blue font-medium"
                        : "hover:border-brand-blue hover:text-brand-blue border-transparent",
                      !isSelected && isOutside && "text-neutral-400",
                      !isSelected && !isOutside && "text-black-1",
                      disabled &&
                        "cursor-not-allowed text-neutral-300 hover:border-transparent hover:text-neutral-300",
                    )}
                  >
                    {day.getDate()}
                    {isToday && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-1.5 size-1",
                          isSelected ? "bg-brand-blue" : "bg-neutral-400",
                        )}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="border-hairline mt-4 flex items-center justify-between gap-2 border-t pt-3">
        <button
          type="button"
          onClick={() => {
            const next = startOfDay(new Date());
            onMonthChange(startOfMonth(next));
            onFocusedDateChange(next);
          }}
          className="font-switzer text-brand-blue outline-brand-blue focus-visible:outline-brand-blue cursor-pointer text-sm"
        >
          Today
        </button>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={selectedDate === null}
            className="font-switzer text-black-3 outline-brand-blue focus-visible:outline-brand-blue hover:text-black-1 cursor-pointer text-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default CalendarPanel;
