export const DAYS_IN_WEEK = 7;

export const CALENDAR_WEEKS = 6;

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const addDays = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

export const addMonths = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const isBeforeDay = (date: Date, other: Date): boolean =>
  startOfDay(date).getTime() < startOfDay(other).getTime();

export const isAfterDay = (date: Date, other: Date): boolean =>
  startOfDay(date).getTime() > startOfDay(other).getTime();

export const clampDate = (date: Date, min?: Date, max?: Date): Date => {
  if (min && isBeforeDay(date, min)) return startOfDay(min);
  if (max && isAfterDay(date, max)) return startOfDay(max);
  return startOfDay(date);
};

export const getCalendarDays = (month: Date, weekStartsOn: number): Date[] => {
  const firstOfMonth = startOfMonth(month);
  const offset = (firstOfMonth.getDay() - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const firstCell = addDays(firstOfMonth, -offset);

  return Array.from({ length: CALENDAR_WEEKS * DAYS_IN_WEEK }, (_, index) =>
    addDays(firstCell, index),
  );
};

export const getWeekdayLabels = (locale: string, weekStartsOn: number): string[] => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const reference = new Date(2024, 0, 7);

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
    formatter.format(addDays(reference, weekStartsOn + index)),
  );
};

export const formatMonthLabel = (month: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);

export const formatFullDate = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

export const formatDisplayDate = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(date);

export const toISODate = (date: Date): string => {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};
