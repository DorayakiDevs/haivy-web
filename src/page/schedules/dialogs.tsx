import { useState } from "react";
import { differenceInHours } from "date-fns";

import { InputText, InputTextErrorable } from "@components/base/input";
import { TextArea } from "@components/base/textarea";
import { UserSearchInput } from "@components/users";
import { DatePicker } from "@components/base/date";
import { Icon } from "@components/icons";

import { useUIContext } from "@context/ui";

import { useValidatableState, validatePhoneNumber } from "@hooks/validator";

import { executeDbRPC } from "@services/rpc/base";
import { useClient } from "@services/client";

import { validateNotEmpty } from "@utils/validator";

import { useSchedulePanel } from "./staff";
import { convertDateToServerTimeString } from "./utils";
import { LTRLoadingBar } from "@components/base/others";

export function CancelDialog({
  dialogRef,
  aptId,
}: {
  dialogRef: any;
  aptId: string;
}) {
  const { alert } = useUIContext();
  const { supabase } = useClient();
  const { reload } = useSchedulePanel();

  const reason = useValidatableState("", validateNotEmpty);

  async function cancelApt() {
    if (!reason.validate()) {
      return;
    }

    const { error } = await executeDbRPC(supabase, "cancel_appointment", {
      p_appointment_id: aptId,
      p_note: reason.current,
    });

    if (error) {
      alert.toggle({
        text: `[${error.code}] An error occurred: ${error.message}`,
        type: "error",
      });
    } else {
      alert.toggle({
        text: "Appointment cancelled",
        type: "success",
      });
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
  const { alert } = useUIContext();
  const { supabase } = useClient();
  const { reload } = useSchedulePanel();

  const note = useValidatableState("", validateNotEmpty);

  async function cancelApt() {
    if (!note.validate()) {
      return;
    }

    const { error } = await executeDbRPC(supabase, "complete_appointment", {
      p_appointment_id: aptId,
      p_note: note.current,
    });

    if (error) {
      alert.toggle({
        text: `[${error.code}] An error occurred: ${error.message}`,
        type: "error",
      });
    } else {
      alert.toggle({
        text: "Appointment marked as complete",
        type: "success",
      });
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
  const { supabase, account } = useClient();
  const { alert } = useUIContext();

  const [loading, setLoading] = useState(false);

  const sDoctor = useState<Haivy.User | null>(null);
  const sDate = useState(new Date());
  const sNote = useState("");
  const sPhone = useState("");

  const doctor = sDoctor[0];
  const date = sDate[0];
  const note = sNote[0];
  const phone = sPhone[0];

  function showError(text: string) {
    alert.toggle({ text, type: "error" });
  }

  async function submit() {
    if (loading) return;

    if (!account) {
      return showError("Cannot verify your session, please try again later!");
    }

    const diffHours = differenceInHours(date, new Date());

    if (diffHours < 4) {
      return showError("Schedule must be set at least 4 hours from now");
    }

    const phoneErr = validatePhoneNumber(phone);
    if (phoneErr) {
      return showError(phoneErr);
    }

    if (!doctor) {
      return showError("Please select a doctor");
    }

    if (!note) {
      return showError("Please provide a note");
    }

    setLoading(true);
    const { error } = await executeDbRPC(supabase, "create_appointment", {
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
      showError(`${error.code} An error occured: ${error.message}`);
      return;
    } else {
      alert.toggle({
        text: "Appointment requested, please wait for updates!",
        type: "success",
      });

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
            <LTRLoadingBar width="w-32" height={4} />
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
