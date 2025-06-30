import { format } from "date-fns";

/**
 *
 * @param date Date object
 * @returns
 */
export function convertGMT00ToLocal(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return date;

  // return addMinutes(date, date.getTimezoneOffset());
}

export function adjustTimeToLocal(list: Haivy.Appointment[]) {
  return list.map((appointment) => {
    const { meeting_date, created_date, ...rest } = appointment;

    const new_meeting = meeting_date
      ? convertGMT00ToLocal(meeting_date).toISOString()
      : null;
    const new_created = created_date
      ? convertGMT00ToLocal(created_date).toISOString()
      : null;

    return {
      ...rest,

      meeting_date: new_meeting,
      created_date: new_created,
    };
  });
}

export function convertDateToServerTimeString(date: Date): string {
  return format(date, "yyyy-MM-dd HH:mm:ss");

  // const offsetMinutes = date.getTimezoneOffset();
  // const adjusted = new Date(date.getTime() - offsetMinutes * 60_000);
  // return format(adjusted, "yyyy-MM-dd HH:mm:ss'+00'");
}
