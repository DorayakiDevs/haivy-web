import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { addMinutes, format, isValid, set } from "date-fns";

import { InputTextErrorable } from "@components/base/input";
import { SubmitWithLoading } from "@components/base/button";
import { UserSearchInput } from "@components/users";
import { SelectOptions } from "@components/base/select";
import { DatePicker } from "@components/base/date";
import { Icon } from "@components/icons";

import { SidePanelWrapper, useSidePanel } from "@context/ui/sidepanel";
import { useUIContext } from "@context/ui";

import { useValidatableState, validatePhoneNumber } from "@hooks/validator";

import { useClient } from "@services/client";

import { useSchedulePanel } from ".";

const DUR_TEMP = [
  { value: "15", text: "15 minutes" },
  { value: "30", text: "30 minutes" },
  { value: "60", text: "1 hour" },
  { value: "90", text: "90 minutes" },
  { value: "120", text: "2 hours" },
];

export function CreateAppointmentExternalPanel() {
  const PANEL_ID = "create_apt";

  const { supabase } = useClient();
  const { panelId } = useSidePanel();
  const { alert } = useUIContext();

  const [params] = useSearchParams();
  const dateStrParam = params.get("date") || "";
  const viewType = params.get("view");

  const { setViewDateParams, setGhostAppointment, reload } = useSchedulePanel();

  const [loading, setLoading] = useState(false);

  const stateDate = useState(new Date());
  const stateDur = useState("30");
  const stateContent = useState("");

  const stateDoctor = useState<Haivy.User | null>(null);
  const statePatient = useState<Haivy.User | null>(null);

  const phone = useValidatableState("", validatePhoneNumber);
  const service = useValidatableState("", (s) => {
    if (!s) return "Service cannot be empty!";
    return "";
  });

  const aptDate = stateDate[0];
  const aptDetails = stateContent[0];
  const aptDur = parseInt(stateDur[0]);
  const aptDoctor = stateDoctor[0];
  const aptPatient = statePatient[0];
  const aptPhone = phone.current;
  const aptService = service.current;

  useEffect(() => {
    if (!isValid(aptDate)) {
      return;
    }

    setViewDateParams(null, aptDate, true);
  }, [aptDate]);

  useEffect(() => {
    if (viewType !== "day") {
      return;
    }

    const d = new Date(dateStrParam);

    if (isValid(d)) {
      stateDate[1]((o) =>
        set(o, {
          date: d.getDate(),
          month: d.getMonth(),
          year: d.getFullYear(),
        })
      );
    }
  }, [dateStrParam]);

  const curTime = format(aptDate, "kk:mm");

  useEffect(() => {
    if (panelId !== PANEL_ID) {
      setGhostAppointment(null);
      return;
    }

    setGhostAppointment({
      meeting_date: aptDate.toISOString(),
      duration: aptDur,
      status: null,
      staff_id: aptDoctor?.user_id,
      patient_id: aptPatient?.user_id,
      content: aptDetails,
    });
  }, [aptDate.toISOString(), aptDur, aptDetails, panelId]);

  async function submitData() {
    if (!phone.validate()) {
      return;
    }

    if (!aptDoctor) {
      return alert.toggle({ text: "Please assign a doctor", type: "error" });
    }

    if (!aptPatient) {
      return alert.toggle({ text: "Please assign a patient", type: "error" });
    }

    setLoading(true);

    const { error } = await supabase.rpc("create_appointment", {
      p_duration: aptDur,
      p_ispublic: true,
      p_doctor_id: aptDoctor.user_id,
      p_patient_id: aptPatient.user_id,
      p_phone: aptPhone,
      p_service_description: aptService,
      p_meeting_date: aptDate.toISOString(),
    });

    if (error) {
      alert.toggle({ text: error.message, type: "error" });
    } else {
      reload();
      alert.toggle({ text: "Appointment created!", type: "success" });
    }

    setLoading(false);
  }

  return (
    <SidePanelWrapper id={PANEL_ID} className="overflow-y-scroll">
      <div className="p-4">
        <div className="text-2xl font-semibold mt-8 mb-2 flex spbtw aiend">
          <div className="pl-2 border-l-8">Create an appointment</div>
          <Icon name="event" size="2rem" />
        </div>
      </div>
      <div className={loading ? "px-4 pointer-events-none opacity-50" : "px-4"}>
        <div className="my-2 border-t-1"></div>

        <div className="my-2">
          <InputTextErrorable
            label="Appointment's details"
            height="h-16"
            state={stateContent}
            placeholder="Insert appointment details here . . ."
            maxLength={64}
          />
          <InputTextErrorable
            label="Service"
            height="h-16"
            state={service.state}
            placeholder="Appointment's service"
            maxLength={32}
          />
        </div>

        <div className="flex aiend gap-4 my-2">
          <DatePicker label="Date" state={stateDate} />
          <SelectOptions
            label="Duration"
            options={DUR_TEMP.map((c) => ({
              ...c,
              sub: `from ${curTime} to ${format(
                addMinutes(aptDate, parseInt(c.value)),
                "kk:mm"
              )}`,
            }))}
            state={stateDur}
            direction="bottom right"
            width="w-70"
            closeOnClick
          />
        </div>

        <div className="my-2">
          <UserSearchInput
            label="Assigned doctor"
            state={stateDoctor}
            roleFilter={["doctor"]}
          />
          <UserSearchInput
            label="Patient"
            state={statePatient}
            roleFilter={["customer"]}
          />
        </div>

        <InputTextErrorable
          label="Patient phone number"
          state={phone.state}
          error={phone.error}
          placeholder="0123 456 789"
          icon="phone"
        />
      </div>
      <div className="p-4">
        <SubmitWithLoading
          text="Create appointment"
          onClick={submitData}
          loading={loading}
        />
      </div>
    </SidePanelWrapper>
  );
}
