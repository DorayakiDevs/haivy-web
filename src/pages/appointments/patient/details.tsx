import { useParams } from "react-router";
import { format } from "date-fns";

import { StatusBadge } from "@components/features/tickets";

import FullscreenLoading from "@pages/others/loading";

import useAppointmentDetails, {
  AppointmentDetailsContext,
  useAptDetails,
} from "../hooks/useAppointmentDetails";

import { PatientTestOrderFrame } from "../frames/frame_patient_test_records";
import { PatientPrescriptionFrame } from "../frames/frame_paitient_prescription";
import { Frame } from "../component";
import { Helmet } from "react-helmet-async";

export default function DetailsPage() {
  const { id } = useParams();

  const value = useAppointmentDetails(id || "");

  if (value.loading) {
    return <FullscreenLoading />;
  }

  if (!value.details) {
    return <></>;
  }

  const { meeting_date, content, status } = value.details;

  return (
    <AppointmentDetailsContext.Provider
      value={{ ...value, details: value.details }}
    >
      <Helmet>
        <title>Haivy | Appointment - {content}</title>
      </Helmet>
      <div className="content-wrapper flex coll pb-8 pr-8">
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

        <div className="flex-1 flex gap-4">
          <PatientPrescriptionFrame />

          <div className="flex coll flex-[1.8]">
            <div className="h-40 flex coll">
              <DoctorNotesFrame />
            </div>
            <PatientTestOrderFrame />
          </div>
        </div>
      </div>
    </AppointmentDetailsContext.Provider>
  );
}

function DoctorNotesFrame() {
  const { details } = useAptDetails();

  return (
    <Frame className="flex-1">
      <div>Note from doctor</div>
      <p className="mt-4">{details!.notes || "No notes were given"}</p>
    </Frame>
  );
}
