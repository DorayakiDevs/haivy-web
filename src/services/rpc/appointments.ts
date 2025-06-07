import { useRPC } from "./base";

// export function useAppointments(date: Date) {
//   const data = useRPC<any>("get_doctor_schedule_with_date", {
//     date_required: date.toLocaleDateString(),
//   });

//   return data;
// }

export function useAppointmentList(start: Date | string, end: Date | string) {
  const data = useRPC<any>("get_doctor_schedule_in_range", {
    begin_date: typeof start === "string" ? start : start.toLocaleDateString(),
    end_date: typeof end === "string" ? end : end.toLocaleDateString(),
  });

  return data;
}
