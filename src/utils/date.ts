import {
  startOfDay,
  getDay,
  subDays,
  addDays,
  getMonth,
  format,
  getYear,
} from "date-fns";

export function getWeekFromDate(
  dateIncluded: Date,
  startDay: "sunday" | "monday" = "sunday"
): Date[] {
  const cleanDate = startOfDay(dateIncluded);
  const startDayNumber = startDay === "sunday" ? 0 : 1;
  const currentDay = getDay(cleanDate);

  const diff = (currentDay - startDayNumber + 7) % 7;
  const weekStart = subDays(cleanDate, diff);

  return Array.from({ length: 7 }, (_, i) => startOfDay(addDays(weekStart, i)));
}

export function formatMonthYearRanges(dates: Date[]): string {
  if (dates.length === 0) {
    return "";
  }

  const year = getYear(dates[0]);
  const appearing = new Set<number>();

  for (let i = 0; i < dates.length; i++) {
    const m = getMonth(dates[i]);
    appearing.add(m);
  }

  const arr = Array.from(appearing);
  arr.sort((a, b) => a - b);

  let continuous = true;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      continuous = false;
      break;
    }
  }

  if (arr.length === 1) {
    continuous = false;
  }

  if (continuous) {
    const start = format(new Date(2000, arr[0]), "LLLL");
    const end = format(new Date(2000, arr[arr.length - 1]), "LLLL");
    return `${start} - ${end} ${year}`;
  }

  return (
    arr.map((a) => format(new Date(year, a), "LLLL")).join(", ") + ` ${year}`
  );
}
