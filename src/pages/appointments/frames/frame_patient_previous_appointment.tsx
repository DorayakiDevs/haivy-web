import { useEffect, useState } from "react";
import { format, formatDistance } from "date-fns";
import { Link } from "react-router";

import { Loading } from "@components/icons/loading";
import { Icon } from "@components/icons/google";

import { Frame } from "@pages/appointments/component";

import { useServices } from "@services/index";

import { useAptDetails } from "../hooks/useAppointmentDetails";

type T_Data = {
  staff: Haivy.User | null;
} & Haivy.Appointment;

export function PreviousAppointmentsFrame() {
  const { client } = useServices();
  const { apt_id, details } = useAptDetails();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T_Data | null>(null);

  if (!details) {
    return <Loading />;
  }

  const { patient_id } = details;

  useEffect(() => {
    if (!apt_id || !patient_id) return;
    const c = new AbortController();

    setLoading(true);
    client
      .from("appointment")
      .select("*, staff:user_details!appointment_staff_id_fkey1(*)")
      .eq("patient_id", patient_id)
      .eq("status", "completed")
      .order("meeting_date", { ascending: false })
      .abortSignal(c.signal)
      .then(({ data, error }) => {
        if (error) {
          setData(null);
        } else {
          setData(data[0]);
        }

        setLoading(false);
      });

    return () => {
      c.abort();
    };
  }, [apt_id, patient_id]);

  const meet_then = data?.meeting_date || "";
  const meet_now = details.meeting_date || "";

  return (
    <Frame className="flex-1">
      <div>Previous appointment</div>

      {loading ? (
        <Loading size="xl" className="m-auto" />
      ) : data ? (
        <Link to={`/appointments/${data.appointment_id}`}>
          <div className="pt-4 flex-1 flex coll">
            <div className="text-lg">{data.content}</div>
            <p className="mb-4">{data.notes || "No notes provided"}</p>
            <div className="flex spbtw">
              <div className="flex aictr gap-2">
                <Icon name="event" />
                Scheduled on
              </div>
              <span>
                {format(meet_then, "dd.MM.yyyy")} (
                {formatDistance(meet_then, meet_now)} from this)
              </span>
            </div>
            <div className="flex spbtw">
              <div className="flex aictr gap-2">
                <Icon name="badge" />
                Doctor
              </div>
              <span>{data.staff?.full_name}</span>
            </div>
            <div className="flex-1"></div>
          </div>
        </Link>
      ) : (
        <div className="tactr py-8">Patient has no past appointments</div>
      )}
    </Frame>
  );
}
