import { useRef } from "react";
import { useParams } from "react-router";
import { format } from "date-fns";

import { SlidePanelWrapper } from "@components/modals/slidepanel";
import { StatusBadge } from "@components/features/tickets";
import { Button } from "@components/shared/buttons";

import { CancelDialog, CompleteDialog } from "@pages/schedule/dialogs";
import FullscreenLoading from "@pages/others/loading";

import { PreviousAppointmentsFrame } from "../frames/frame_patient_previous_appointment";
import { PatientPrescriptionFrame } from "../frames/frame_paitient_prescription";
import { CurrentAppointmentFrame } from "../frames/frame_current_appointment";
import { PatientTestOrderFrame } from "../frames/frame_patient_test_records";
import { PatientOverviewFrame } from "../frames/frame_patient_overview";

import PrescribeMedicinePanel from "./prescribe";
import { Frame } from "../component";

import useAppointmentDetails, {
  AppointmentDetailsContext,
  useAptDetails,
} from "../hooks/useAppointmentDetails";
import { TestRequestPanel } from "./test_request";
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

  return (
    <AppointmentDetailsContext.Provider
      value={{
        ...value,
        details: value.details,
      }}
    >
      <DetailsPageWithoutProvider />
    </AppointmentDetailsContext.Provider>
  );
}

function DetailsPageWithoutProvider() {
  const { reload, apt_id, details } = useAptDetails();

  const completeDialogRef = useRef<any | null>(null);
  const cancelDialogRef = useRef<any | null>(null);

  const closeHandler = (q: any) => () => q.current?.close();
  const openHandler = (q: any) => () => q.current?.showModal();

  function handleComplete(q: any) {
    return () => {
      // setStamp(stamp() + "-d");
      closeHandler(q)();
      reload();
    };
  }

  const { meeting_date, status, content, is_online } = details;

  return (
    <>
      <Helmet>
        <title>Haivy | Appointment - {content}</title>
      </Helmet>
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
            <StatusBadge status={is_online ? "Online" : "Offline"} />
            {status !== "scheduled" || (
              <div className="flex-1 flex aictr jcend gap-4">
                <Button
                  className="btn-success"
                  onClick={openHandler(completeDialogRef)}
                >
                  Complete appointment
                </Button>
                <Button
                  className="btn-error btn-soft"
                  onClick={openHandler(cancelDialogRef)}
                >
                  Cancel appointment
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          {(() => {
            switch (details.status) {
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
        basePath={"/appointments/" + apt_id}
        children={<PrescribeMedicinePanel />}
      />

      <SlidePanelWrapper
        path="/lab_request"
        className="w-[90%]"
        basePath={"/appointments/" + apt_id}
        children={<TestRequestPanel />}
      />

      <CompleteDialog
        dialogRef={completeDialogRef}
        aptId={apt_id}
        onComplete={handleComplete(completeDialogRef)}
      />

      <CancelDialog
        dialogRef={cancelDialogRef}
        aptId={apt_id}
        onComplete={handleComplete(cancelDialogRef)}
      />
    </>
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
      <div className="flex-8 flex coll">
        {/* <PatientMedicalInfoFrame /> */}
        <PatientPrescriptionFrame />
      </div>
      <div className="flex-8 flex coll">
        <PatientTestOrderFrame />
      </div>
    </div>
  );
}

function AppointmentLayoutCompleted() {
  return (
    <div className="h-full flex gap-4">
      <div className="w-108 flex coll">
        <PatientOverviewFrame />
        <CurrentAppointmentFrame />
        <DoctorNotesFrame />
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
  return (
    <div>
      <PatientOverviewFrame />
      <CurrentAppointmentFrame />
      <DoctorNotesFrame />
    </div>
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
