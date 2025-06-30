import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { addMinutes, isValid, set } from "date-fns";

import { InputTextErrorable } from "@components/base/input";
import { SubmitWithLoading } from "@components/base/button";
import { UserSearchInput } from "@components/users";
import { SelectOptions } from "@components/base/select";
import { DatePicker } from "@components/base/date";
import { Icon } from "@components/icons";

import { useClient } from "@services/client";

import { SidePanelWrapper, useSidePanel } from "@context/ui/sidepanel";
import { useUIContext } from "@context/ui";

import { useValidatableState, validatePhoneNumber } from "@hooks/validator";

import { DateUtils } from "@utils/date";

import { useSchedulePanel } from "./staff";
import { convertDateToServerTimeString } from "./utils";

const DUR_TEMP = [
  { value: "15", text: "15 minutes" },
  { value: "30", text: "30 minutes" },
  { value: "60", text: "1 hour" },
  { value: "90", text: "90 minutes" },
  { value: "120", text: "2 hours" },
];

export function AppointmentExternalPanel() {
  const PANEL_ID = "ext_apt";

  const { supabase, session } = useClient();
  const { panelId, close } = useSidePanel();
  const { alert } = useUIContext();

  const [params] = useSearchParams();
  const dateStrParam = params.get("date") || "";
  const viewType = params.get("view");

  const { setViewDateParams, setGhostAppointment, reload } = useSchedulePanel();

  const [loading, setLoading] = useState(false);

  const stateDate = useState(new Date());
  const stateDur = useState("30");
  const stateContent = useState("");

  // const stateDoctor = useState<Haivy.User | null>(null);
  const statePatient = useState<Haivy.User | null>(null);

  const phone = useValidatableState("", validatePhoneNumber);
  const service = useValidatableState("", (s) => {
    if (!s) return "Service cannot be empty!";
    return "";
  });

  const aptDate = stateDate[0];
  const aptDetails = stateContent[0];
  const aptDur = parseInt(stateDur[0]);
  // const aptDoctor = stateDoctor[0];
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

  const curTime = DateUtils.format(aptDate, "kk:mm");

  useEffect(() => {
    if (panelId !== PANEL_ID) {
      setGhostAppointment(null);
      return;
    }

    setGhostAppointment({
      meeting_date: aptDate.toISOString(),
      duration: aptDur,
      status: null,
      content: aptDetails,
    });
  }, [aptDate.toISOString(), aptDur, aptDetails, panelId]);

  async function submitData() {
    if (!phone.validate()) {
      return;
    }

    // if (!aptDoctor) {
    //   return alert.toggle({ text: "Please assign a doctor", type: "error" });
    // }

    if (!aptPatient) {
      return alert.toggle({ text: "Please assign a patient", type: "error" });
    }

    setLoading(true);

    const { error } = await supabase.rpc("create_appointment", {
      p_duration: aptDur,
      p_is_public: true,
      p_doctor_id: session?.user.id,
      p_patient_id: aptPatient.user_id,
      p_phone: aptPhone,
      p_service_desc: aptService,
      p_meeting_date: convertDateToServerTimeString(aptDate),
      p_content: aptDetails,
    });

    if (error) {
      alert.toggle({ text: error.message, type: "error" });
    } else {
      reload();
      alert.toggle({ text: "Appointment created!", type: "success" });
      setViewDateParams("schedule", aptDate);
      close();
    }

    setLoading(false);
  }

  return (
    <SidePanelWrapper id={PANEL_ID} className="overflow-y-scroll">
      <div>
        <div className="text-2xl font-semibold mb-2 flex spbtw aiend">
          <div>Create appointment</div>
          <Icon name="calendar_add_on" size="2rem" />
        </div>
      </div>
      <div className={loading ? "pointer-events-none opacity-50" : ""}>
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
              sub: `from ${curTime} to ${DateUtils.format(
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
          {/* <UserSearchInput
            label="Assigned doctor"
            state={stateDoctor}
            roleFilter={["doctor"]}
          /> */}
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
      <div>
        <SubmitWithLoading
          children="Create appointment"
          onClick={submitData}
          loading={loading}
        />
      </div>
    </SidePanelWrapper>
  );
}
