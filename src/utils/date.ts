import {
  startOfDay,
  getDay,
  subDays,
  addDays,
  getMonth,
  format as fnsFormat,
  getYear,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

export class DateUtils {
  /**
   * Format date to format string, adjusted to local timezone
   * @param date Date to format
   * @param fStr Format template / string
   * @returns Formatted adjusted date
   *
   * @deprecated
   */
  static lFormat(date: Date, fStr: string) {
    const adjusted = date.getTimezoneOffset() * 60 * 1000;

    if (adjusted === 0) {
      return DateUtils.format(date, fStr);
    }

    console.log(date.getTimezoneOffset());

    return DateUtils.format(new Date(date.valueOf() + adjusted), fStr);
  }

  /**
   * Format list of date to return "month, year"
   * @param dates Dates to include
   * @returns Month, Year format
   *
   * ```
   * formatMonthYearRanges(["June 12th, 2024", "June 14th, 2024"]) // "June 2024"
   * formatMonthYearRanges(["June 31st, 2024", "July 1st, 2024"]) // "June - July 2024"
   * ```
   */
  static formatMonthYearRanges(dates: Date[]): string {
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
      const start = fnsFormat(new Date(2000, arr[0]), "LLLL");
      const end = fnsFormat(new Date(2000, arr[arr.length - 1]), "LLLL");
      return `${start} - ${end} ${year}`;
    }

    return (
      arr.map((a) => fnsFormat(new Date(year, a), "LLLL")).join(", ") +
      ` ${year}`
    );
  }

  /**
   * Returns the week starting from startDay and contains dateIncluded
   * @param dateIncluded Date must be included in the week
   * @param startDay Week's start day
   * @returns 7 dates of the week
   */
  static getWeekFromDate(
    dateIncluded: Date,
    startDay: "sunday" | "monday" = "sunday"
  ): Date[] {
    const cleanDate = startOfDay(dateIncluded);
    const startDayNumber = startDay === "sunday" ? 0 : 1;
    const currentDay = getDay(cleanDate);

    const diff = (currentDay - startDayNumber + 7) % 7;
    const weekStart = subDays(cleanDate, diff);

    return Array.from({ length: 7 }, (_, i) =>
      startOfDay(addDays(weekStart, i))
    );
  }

  /**
   * Wrapper for date-fns `format()`
   * @param date Date to format
   * @param f Format string
   * @returns Formatted date
   */
  static format(date: Date, f: string) {
    return fnsFormat(date, f);
  }

  /**
   * Return formatted date using default format
   * @param dateStr Date string
   * @returns Formatted date (default format)
   */
  static dFormat(dateStr: string | null): string {
    const date = dateStr ? new Date(dateStr) : new Date();
    return DateUtils.format(date, "dd/MM/yyyy '-' HH:mm");
  }

  static GetLocalTimezone() {
    const z = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return z;
  }

  /**
   * Adjust and convert (if necessary) to local timezone
   * @param dateStr Date to convert (string)
   * @returns Converted date
   * @experimental
   */
  static lConvert(dateStr: string): Date;

  static lConvert(dateStr: string): Date {
    const s = toZonedTime(dateStr, this.GetLocalTimezone());
    console.log(dateStr, " -> ", s.toISOString());

    return s;
  }
}
