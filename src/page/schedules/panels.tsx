import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { addMinutes, format, isValid, set } from "date-fns";

import { InputTextErrorable } from "@components/base/input";
import { SelectOptions } from "@components/base/select";
import { LoadingIcon } from "@components/icons/others";
import { TextArea } from "@components/base/textarea";
import { DatePicker } from "@components/base/date";
import { UserInfo } from "@components/users";
import { Icon } from "@components/icons";

import { SidePanelWrapper, useSidePanel } from "@context/ui/sidepanel";

import { useUserList } from "@services/rpc/user";

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

  const { panelId } = useSidePanel();

  const [params] = useSearchParams();
  const dateStrParam = params.get("date") || "";
  const viewType = params.get("view");

  const { setViewDateParams, setGhostAppointment } = useSchedulePanel();

  const stateDate = useState(new Date());
  const stateDur = useState("30");

  const stateDetails = useState("");

  const stateDoctor = useState<Haivy.User | null>(null);
  const statePatient = useState<Haivy.User | null>(null);
  const statePhone = useState("");

  const aptDate = stateDate[0];
  const aptDetails = stateDetails[0];
  const aptDur = parseInt(stateDur[0]);
  const aptDoctor = stateDoctor[0];
  const aptPatient = statePatient[0];

  // const aptPhone = statePhone[0];

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
  }, [aptDate, aptDur, aptDetails, panelId]);

  return (
    <SidePanelWrapper id={PANEL_ID}>
      <div className="p-4">
        <div className="text-2xl font-semibold mt-8 mb-2 flex spbtw aiend">
          <div className="pl-2 border-l-8">Create an appointment</div>
          <Icon name="event" size="2rem" />
        </div>

        <div className="my-4 border-t-1"></div>

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

        <div className="my-4">
          <UserSearchInput label="Assigned doctor" state={stateDoctor} />
          <UserSearchInput label="Patient" state={statePatient} />
        </div>

        <InputTextErrorable
          label="Patient phone number"
          maxLength={32}
          state={statePhone}
          icon="phone"
        />

        <TextArea
          label="Appointment's details"
          height="h-16"
          state={stateDetails}
          placeholder="Insert appointment details here . . . "
          maxLength={64}
        />

        <button className="btn btn-primary btn-outline w-full my-8">
          Create appointment
        </button>
      </div>
    </SidePanelWrapper>
  );
}

type T_UserSearchProps = {
  label?: string;
  state: [
    Haivy.User | null,
    React.Dispatch<React.SetStateAction<Haivy.User | null>>
  ];
};

function UserSearchInput(props: T_UserSearchProps) {
  const { label = "Search user" } = props;

  const local = useState<Haivy.User | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [curIndex, setCurIndex] = useState(0);

  const list = useUserList(userQuery);

  const [user, setUser] = props.state || local;

  function handleKeyDown(e: React.KeyboardEvent) {
    const { key } = e;

    if (list.status !== "success") return;

    const l = list.data;

    switch (key) {
      case "ArrowDown": {
        setCurIndex((i) => (i + 1 >= l.length ? 0 : i + 1));
        break;
      }

      case "ArrowUp": {
        setCurIndex((i) => (i - 1 < 0 ? l.length - 1 : i - 1));
        break;
      }

      case "Enter": {
        setUser(l[curIndex]);
        return;
      }
    }
  }

  return (
    <div className="dropdown dropdown-end w-full block">
      {user ? (
        <InputTextErrorable
          className="w-full"
          label={label}
          state={[user.full_name, () => setUser(null)]}
          icon="person"
        />
      ) : (
        <>
          <InputTextErrorable
            className="w-full"
            label={label}
            state={[userQuery, setUserQuery]}
            placeholder="Type to search"
            icon="person"
            onKeyDown={handleKeyDown}
          />
          <div className="menu dropdown-content w-full bg-base-100 shadow-xl rounded-lg">
            {(() => {
              if (user) {
                return "";
              }

              if (list.status === "loading") {
                return (
                  <div className="w-full flex jcctr">
                    <LoadingIcon />
                  </div>
                );
              }

              if (list.status !== "success") {
                return "";
              }

              if (!list.data?.length) {
                return (
                  <i className="tactr my-4">Cannot find any suitable user</i>
                );
              }

              return list.data.map((u, i) => {
                return (
                  <li
                    key={u.user_id + "i"}
                    onMouseDown={() => setUser(u)}
                    className={i === curIndex ? "bg-base-300 rounded-md" : ""}
                  >
                    <UserInfo data={u} />
                  </li>
                );
              });
            })()}
          </div>
        </>
      )}
    </div>
  );
}
