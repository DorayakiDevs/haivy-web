import { useServices } from "@services/index";
import { stamp } from "@utils/date";
import { createContext, useContext, useEffect, useState } from "react";

export type T_Data = {
  staff: Haivy.User | null;
  patient: Haivy.User | null;
} & Haivy.DBRow<"appointment">;

export type T_Context = {
  details: T_Data;
  loading: boolean;
  apt_id: string;
  reload(save?: boolean): void;
};

export default function useAppointmentDetails(id: string) {
  const { client } = useServices();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T_Data | null>(null);
  const [_stamp, setStamp] = useState(stamp());

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (!id) return;
      if (!_stamp.endsWith("-d")) {
        setLoading(true);
      }

      const promise = client
        .from("appointment")
        .select(
          `
            *, 
            staff:user_details!appointment_staff_id_fkey1(*),
            patient:user_details!appointment_patient_id_fkey1(*)
          `
        )
        .eq("appointment_id", id)
        .abortSignal(controller.signal)
        .single();

      const { data, error } = await promise;

      if (controller.signal.aborted) {
        return;
      }

      if (error) {
        console.error(error);
        return;
      }

      setData(data);

      controller.abort();
      setLoading(false);
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, _stamp]);

  function reload(save?: boolean) {
    setStamp(stamp() + (save ? "-d" : ""));
  }

  return { details: data, loading, reload, apt_id: id };
}

export const AppointmentDetailsContext = createContext<T_Context | null>(null);

export function useAptDetails() {
  const data = useContext(AppointmentDetailsContext);
  if (!data) throw new Error("Appointment details context data missing!");

  return data;
}
