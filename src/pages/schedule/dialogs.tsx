import { useState } from "react";
import { differenceInHours } from "date-fns";

import {
  InputText,
  InputTextErrorable,
  TextArea,
} from "@components/shared/text";
import { UserSearchInput } from "@components/shared/users";

import { DatePicker } from "@components/shared/date";
import { Icon } from "@components/icons/google";

import useUI from "@hooks/useUI";

import { validatePhoneNumber, validateNotEmpty } from "@utils/validator";

import { convertDateToServerTimeString } from "./utils";
import { useSchedulePanel } from "./staff";
import { useServices } from "@services/index";
import { useValidatableState } from "@hooks/useValidatableState";
import { Loading } from "@components/icons/loading";

export function CancelDialog({
  dialogRef,
  aptId,
}: {
  dialogRef: any;
  aptId: string;
}) {
  const { toaster } = useUI();
  const { client } = useServices();
  const { reload } = useSchedulePanel();

  const reason = useValidatableState("", validateNotEmpty);

  async function cancelApt() {
    if (!reason.validate()) {
      return;
    }

    const { error } = await client.rpc("cancel_appointment", {
      p_appointment_id: aptId,
      p_note: reason.current,
    });

    if (error) {
      toaster.error(`[${error.code}] An error occurred: ${error.message}`);
    } else {
      toaster.success("Appointment cancelled");
      reload();
    }
  }

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box overflow-hidden">
        <h3 className="font-bold text-lg mb-8">
          Tell us why you are cancelling this appointment?
        </h3>

        <InputTextErrorable
          label="Your reason"
          placeholder="Your reason..."
          state={reason.state}
          error={reason.error}
        />

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost">Cancel</button>
          </form>
          <label className="btn btn-error" onClick={cancelApt}>
            Submit
          </label>
        </div>
      </div>
    </dialog>
  );
}

export function CompleteDialog({
  dialogRef,
  aptId,
}: {
  dialogRef: any;
  aptId: string;
}) {
  const { toaster } = useUI();
  const { client } = useServices();
  const { reload } = useSchedulePanel();
  const note = useValidatableState("", validateNotEmpty);

  async function cancelApt() {
    if (!note.validate()) {
      return;
    }

    const { error } = await client.rpc("complete_appointment", {
      p_appointment_id: aptId,
      p_note: note.current,
    });

    if (error) {
      toaster.error(`[${error.code}] An error occurred: ${error.message}`);
    } else {
      toaster.success("Appointment marked as complete");
      reload();
    }
  }

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box overflow-hidden">
        <h3 className="font-bold text-lg mb-8">Mark as complete</h3>

        <InputTextErrorable
          label="Appointment's note"
          placeholder="Give your notes here . . ."
          state={note.state}
          error={note.error}
        />

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost">Cancel</button>
          </form>
          <label className="btn btn-success" onClick={cancelApt}>
            Submit
          </label>
        </div>
      </div>
    </dialog>
  );
}

export function RequestAppointmentDialog({
  state,
  onFinish,
}: {
  state: React.State<boolean>;
  onFinish?: () => void;
}) {
  const { client, auth } = useServices();
  const { toaster } = useUI();

  const account = auth.userDetails;

  const [loading, setLoading] = useState(false);

  const sDoctor = useState<Haivy.User | null>(null);
  const sDate = useState(new Date());
  const sNote = useState("");
  const sPhone = useState("");

  const doctor = sDoctor[0];
  const date = sDate[0];
  const note = sNote[0];
  const phone = sPhone[0];

  async function submit() {
    if (loading) return;

    if (!account) {
      return toaster.error(
        "Cannot verify your session, please try again later!"
      );
    }

    const diffHours = differenceInHours(date, new Date());

    if (diffHours < 4) {
      return toaster.error("Schedule must be set at least 4 hours from now");
    }

    const phoneErr = validatePhoneNumber(phone);
    if (phoneErr) {
      return toaster.error(phoneErr);
    }

    if (!doctor) {
      return toaster.error("Please select a doctor");
    }

    if (!note) {
      return toaster.error("Please provide a note");
    }

    setLoading(true);
    const { error } = await client.rpc("create_appointment", {
      p_content: note.trim(),
      p_doctor_id: doctor?.user_id,
      p_duration: 30,
      p_meeting_date: convertDateToServerTimeString(date),
      p_is_public: true,
      p_patient_id: account.user_id,
      p_phone: phone.trim(),
      p_service_desc: "Check-up",
    });

    if (error) {
      toaster.error(`${error.code} An error occured: ${error.message}`);
      return;
    } else {
      toaster.success("Appointment requested, please wait for updates!");

      if (onFinish) {
        onFinish();
      }

      setShown(false);
    }

    setLoading(false);
  }

  const [shown, setShown] = state;

  if (!shown) return;

  return (
    <div
      className="flex aictr jcctr fixed top-0 left-0 w-full h-full z-10 bg-[#0005]"
      id="request-modal"
    >
      <div className="w-130 bg-base-100 p-6 rounded-box pt-8 overflow-hidden">
        <h3 className="text-xl flex aictr gap-2 font-bold mb-8">
          <Icon name="calendar_add_on" />
          Request an appointment
        </h3>

        <DatePicker label="Meeting date" state={sDate} />
        <div className="h-4"></div>
        <InputText label="Phone number" icon="phone" state={sPhone} />
        <div className="h-4"></div>
        <UserSearchInput
          label="Request doctor (optional)"
          roleFilter={["doctor"]}
          state={sDoctor}
        />
        <div className="h-4"></div>
        <TextArea
          label="Reason/note for doctor"
          state={sNote}
          maxLength={64}
          height="h-18"
        />

        {loading ? (
          <div className="p-8">
            <Loading type="bars" size="xl" />
          </div>
        ) : (
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setShown(false)}>
              Cancel
            </button>
            <input
              type="button"
              className="btn btn-primary"
              value="Submit request"
              onClick={submit}
            />
          </div>
        )}
      </div>
    </div>
  );
}
