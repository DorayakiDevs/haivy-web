import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";

import { SlidePanelWrapper } from "@components/modals/slidepanel";
import { StatusBadge } from "@components/features/tickets";

import FullscreenLoading from "@pages/others/loading";

import { useServices } from "@services/index";

import { stamp } from "@utils/date";

import { PatientOverviewFrame } from "./frames/patient_overview";
import { PreviousAppointmentsFrame } from "./frames/patient_previous_appointment";
import { PatientMedicalInfoFrame } from "./frames/patient_medical_info";
import { CurrentAppointmentFrame } from "./frames/current_appointment";
import { PatientPrescriptionFrame } from "./frames/paitient_prescription";
import { PatientTestOrderFrame } from "./frames/patient_test_records";

import PrescribeMedicinePanel from "./prescribe";
import { Frame } from "../component";

type T_Data = {
  staff: Haivy.User | null;
  patient: Haivy.User | null;
} & Haivy.DBRow<"appointment">;

type T_Context = {
  details: T_Data;
  loading: boolean;
  apt_id: string | null;
  reload(): void;
};

const AppointmentDetailsContext = createContext<T_Context | null>(null);

export function useAptDetails() {
  const data = useContext(AppointmentDetailsContext);
  if (!data) throw new Error("Appointment details context data missing!");

  return data;
}

export default function DetailsPage() {
  const { client } = useServices();
  const { id } = useParams();

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

  if (loading) {
    return <FullscreenLoading />;
  }

  if (!data) {
    return <></>;
  }

  const { meeting_date, status, content } = data;

  const value = {
    details: data,
    loading,
    apt_id: data ? data.appointment_id : null,
    reload() {
      setStamp(stamp() + "-d");
    },
  };

  return (
    <AppointmentDetailsContext.Provider value={value}>
      <div className="content-wrapper flex coll pr-8 pb-4">
        <div className="py-4 mt-8">
          <div className="flex aictr gap-2">
            <div>Appointment Details</div>
            <div>|</div>
            {meeting_date
              ? format(meeting_date, "EEEE, MMMM dd, yyyy - kk:mm")
              : ""}
          </div>
          <div className="flex aictr gap-2 mt-2">
            <div className="head-text">{content}</div>
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="flex-1">
          {(() => {
            switch (data.status) {
              case "scheduled":
              case "in_progress": {
                return <AppointmentLayoutScheduled />;
              }

              case "completed": {
                return <AppointmentLayoutCompleted />;
              }

              default: {
                return <AppointmentLayoutOthers />;
              }
            }
          })()}
        </div>
      </div>

      <SlidePanelWrapper
        path="/prescribe"
        className="w-[90%]"
        children={<PrescribeMedicinePanel />}
      />
    </AppointmentDetailsContext.Provider>
  );
}

function AppointmentLayoutScheduled() {
  return (
    <div className="h-full flex gap-4">
      <div className="flex-7 flex coll">
        <PatientOverviewFrame />
        <CurrentAppointmentFrame />
        <PreviousAppointmentsFrame />
      </div>
      <div className="flex-6 flex coll">
        <PatientMedicalInfoFrame />
      </div>
      <div className="flex-8 flex coll">
        <PatientPrescriptionFrame />
        <PatientTestOrderFrame />
      </div>
    </div>
  );
}

function AppointmentLayoutCompleted() {
  const { details } = useAptDetails();

  return (
    <div className="h-full flex gap-4">
      <div className="w-108 flex coll">
        <PatientOverviewFrame />
        <CurrentAppointmentFrame />
        <Frame className="flex-1">
          <div>Note from doctor</div>
          <p className="mt-4">{details.notes || "No notes were given"}</p>
        </Frame>
      </div>
      <div className="flex-1 flex coll">
        <PatientTestOrderFrame />
      </div>
      <div className="flex-1 flex coll">
        <PatientPrescriptionFrame />
      </div>
    </div>
  );
}

function AppointmentLayoutOthers() {
  return <div></div>;
}
