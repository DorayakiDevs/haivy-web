import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { addMinutes, format, isValid, set } from "date-fns";

import { InputTextErrorable } from "@components/base/input";
import { SelectOptions } from "@components/base/select";
import { TextArea } from "@components/base/textarea";
import { DatePicker } from "@components/base/date";
import { Icon } from "@components/icons";

import { SidePanelWrapper, useSidePanel } from "@context/ui/sidepanel";

import { useSchedulePanel } from ".";
import { UserAutoInfo } from "@components/users";
import { useUserList } from "@services/data/user";

const DUR_TEMP = [
  { value: "15", text: "15 minutes" },
  { value: "30", text: "30 minutes" },
  { value: "60", text: "1 hour" },
  { value: "90", text: "90 minutes" },
  { value: "120", text: "2 hours" },
];

export function CreateAppointmentExternalPanel() {
  const PANEL_ID = "create_apt";

  const { panelId } = useSidePanel();

  const [params] = useSearchParams();
  const dateStrParam = params.get("date") || "";
  const viewType = params.get("view");

  const { setViewDateParams, setGhostAppointment } = useSchedulePanel();

  const stateDate = useState(new Date());
  const stateDur = useState("30");

  const stateDetails = useState("");

  const stateDoctor = useState("");
  const statePatient = useState("");
  const statePhone = useState("");

  const aptDate = stateDate[0];
  const aptDetails = stateDetails[0];
  const aptDur = parseInt(stateDur[0]);
  const aptDoctor = stateDoctor[0];
  const aptPatient = statePatient[0];
  const aptPhone = statePhone[0];

  const [userQuery, setUserQuery] = useState("");
  const list = useUserList(userQuery);

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
      status: "ghost",
      staff_id: aptDoctor,
      patient_id: aptPatient,
      content: aptDetails,
    });
  }, [aptDate, aptDur, aptDetails, panelId]);

  return (
    <SidePanelWrapper id={PANEL_ID}>
      <div className="p-4">
        <div className="text-2xl font-semibold mt-8 mb-2 flex spbtw aiend">
          <div className="pl-2 border-l-8">Create an appointment</div>
          <Icon name="event" size="2rem" />
        </div>

        <div className="h-4 border-t-1"></div>
        <div className="h-4"></div>

        <div className="flex aiend gap-4">
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
          />
        </div>

        <div className="h-4"></div>

        <div className="dropdown dropdown-end w-full">
          <InputTextErrorable
            className="w-full"
            label="Assigned doctor"
            state={[userQuery, setUserQuery]}
            icon="badge"
          />
          {list.status !== "success" ||
            list.data.users.map((u) => {
              return (
                <li key={u.id}>
                  <UserAutoInfo id={u.id} />
                </li>
              );
            })}
        </div>

        <InputTextErrorable
          label="Patient"
          maxLength={32}
          state={statePatient}
          icon="person"
        />

        <div className="h-4"></div>

        <InputTextErrorable
          label="Contact phone number"
          maxLength={32}
          state={statePhone}
          icon="phone"
        />

        <TextArea
          label="Appointment's details"
          height="h-16"
          state={stateDetails}
          placeholder="Insert appointment details here . . . "
        />

        <button className="btn btn-primary btn-outline w-full my-8">
          Create appointment
        </button>
      </div>
    </SidePanelWrapper>
  );
}
