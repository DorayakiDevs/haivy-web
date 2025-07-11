import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { addMinutes, format, isValid, set } from "date-fns";

import { SidePanelWrapper } from "@components/modals/sidepanel";
import { InputTextErrorable } from "@components/shared/text";
import { UserSearchInput } from "@components/shared/users";
import { SelectOptions } from "@components/shared/select";
import { DatePicker } from "@components/shared/date";
import { Button } from "@components/shared/buttons";
import { Icon } from "@components/icons/google";

import { useValidatableState } from "@hooks/useValidatableState";
import useUI from "@hooks/useUI";

import { useServices } from "@services";

import { validateNotEmpty, validatePhoneNumber } from "@utils/validator";

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

  const { client, auth } = useServices();
  const session = auth.session;

  const { sidePanel, toaster } = useUI();

  const [params] = useSearchParams();
  const dateStrParam = params.get("date") || "";
  const viewType = params.get("view");

  const { setViewDateParams, setGhostAppointment, reload } = useSchedulePanel();

  const [loading, setLoading] = useState(false);

  const stateDate = useState(new Date());
  const stateDur = useState("30");

  // const stateDoctor = useState<Haivy.User | null>(null);
  const statePatient = useState<Haivy.User | null>(null);

  const phone = useValidatableState("", validatePhoneNumber);
  const service = useValidatableState("", validateNotEmpty);
  const content = useValidatableState("", validateNotEmpty);

  const aptDate = stateDate[0];
  const aptDetails = content.current;
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

  const curTime = format(aptDate, "kk:mm");

  useEffect(() => {
    if (sidePanel.panelId !== PANEL_ID) {
      setGhostAppointment(null);
      return;
    }

    setGhostAppointment({
      meeting_date: aptDate.toISOString(),
      duration: aptDur,
      status: null,
      content: aptDetails,
    });
  }, [aptDate.toISOString(), aptDur, aptDetails, sidePanel.panelId]);

  async function submitData() {
    const a = phone.validate();
    const b = service.validate();
    const c = content.validate();

    if (!a || !b || !c) {
      return;
    }

    if (!session) {
      return toaster.error("Not authorized, please reload the page!");
    }

    if (!aptPatient) {
      return toaster.error("Please assign a patient");
    }

    setLoading(true);

    const { error } = await client.rpc("create_appointment", {
      p_duration: aptDur,
      p_is_public: true,
      p_doctor_id: session.user.id,
      p_patient_id: aptPatient.user_id,
      p_phone: aptPhone,
      p_service_desc: aptService,
      p_meeting_date: convertDateToServerTimeString(aptDate),
      p_content: aptDetails,
    });

    if (error) {
      toaster.error(error.message);
    } else {
      toaster.success("Appointment created!");
      setViewDateParams("schedule", aptDate);

      reload();
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
            state={content.state}
            error={content.error}
            placeholder="Insert appointment details here . . ."
            maxLength={64}
          />
          <InputTextErrorable
            label="Service"
            height="h-16"
            state={service.state}
            error={service.error}
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
      <div className="py-4">
        <Button
          onClick={submitData}
          loading={loading}
          width="w-full"
          color="primary"
        >
          Create appointment
        </Button>
      </div>
    </SidePanelWrapper>
  );
}
