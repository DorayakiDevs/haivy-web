import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { addMinutes, getHours, getMinutes, isToday } from "date-fns";
import "./components.styles.css";

import { getStatusColor, StatusBadge } from "@components/base/badge";
import { Tooltips } from "@components/base/others";
import { UserInfo } from "@components/users";
import { Icon } from "@components/icons";

import { useUIContext } from "@context/ui";

import { DateUtils } from "@utils/date";

import { CancelDialog, CompleteDialog } from "./dialogs";

export function DetailCards({
  details,
  close,
}: {
  details: Haivy.Appointment;
  close: () => void;
}) {
  const { alert } = useUIContext();
  const cancelRef = useRef<HTMLDialogElement | null>(null);
  const completeRef = useRef<HTMLDialogElement | null>(null);

  const statusState = useState(details.status || "");

  const date = new Date(details.meeting_date || "");
  const endDate = addMinutes(date, details.duration);

  const status = statusState[0];

  function toggleEditMode() {
    alert.toggle({
      text: "Editing is not available for appointments",
      type: "warning",
    });
  }

  function toggleCancelDialog() {
    cancelRef.current?.showModal();
  }

  function toggleCompleteDialog() {
    completeRef.current?.showModal();
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-[#0003] z-5 flex aictr jcctr key-fade-in"
      onClick={close}
    >
      <div
        className="card bg-base-200 shadow-xl border-t-12 min-w-80 z-10 w-[30%]"
        style={{ borderColor: getStatusColor(status) }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex spbtw h-15 p-2">
          <div className="btn w-8 h-8 cursor-grab">
            <Icon name="drag_handle" size="1.2em" />
          </div>

          <div className="gap-1">
            <Tooltips text="Edit">
              <button
                className="btn btn-ghost w-8 h-8"
                onClick={toggleEditMode}
              >
                <Icon name="edit" size="1.2em" />
              </button>
            </Tooltips>

            <Tooltips text="Dimiss">
              <button className="btn btn-ghost w-8 h-8" onClick={close}>
                <Icon name="close" size="1.2em" />
              </button>
            </Tooltips>
          </div>
        </div>

        <div className="text-lg font-semibold mb-4 link link-hover px-4">
          {details.content?.trim() || "Unnamed appointment"}
        </div>

        <div className="text-sm px-4 w-full">
          <div className="flex aictr gap-4 mb-2">
            <Icon name="schedule" size="1.5em" />
            <div>
              <div>{DateUtils.format(date, "PPPP")}</div>
              <div>
                {DateUtils.format(date, "HH:mm")} -{" "}
                {DateUtils.format(endDate, "HH:mm")}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <Icon name="subject" size="1.5em" />
            <div>{details.content?.trim() || "No information provided"}</div>
          </div>

          <div className="flex gap-4 mb-4">
            <Icon name="info" size="1.5em" />
            <div className="flex aictr spbtw flex-1">
              Status:
              <StatusBadge status={status} />
            </div>
          </div>

          <div className="flex gap-4 mb-4 flex-1">
            <Icon name="person" size="1.5em" />
            <div className="flex-1">
              <div className="flex aictr spbtw gap-4 my-1">
                <div>Patient: </div>
                <UserInfo
                  data={(details as any).patient}
                  hideAvatar
                  roleCount={0}
                />
              </div>
              <div className="flex aictr spbtw gap-4 my-1">
                <div>Assigned to: </div>
                <UserInfo
                  data={(details as any).staff}
                  hideAvatar
                  roleCount={0}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <Icon name="confirmation_number" size="1.5em" />
            <Link
              to={`/tickets/${details.ticket_id}`}
              className="link link-hover"
            >
              Support ticket link <Icon name="open_in_new" size="1em" />
            </Link>
          </div>

          {status !== "scheduled" || (
            <div className="flex aictr mb-4 gap-2">
              <button
                className="btn btn-success flex-1"
                onClick={toggleCompleteDialog}
              >
                Complete
              </button>
              <button
                className="btn btn-error btn-soft flex-1"
                onClick={toggleCancelDialog}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <CancelDialog dialogRef={cancelRef} aptId={details.appointment_id} />
        <CompleteDialog
          dialogRef={completeRef}
          aptId={details.appointment_id}
        />
      </div>
    </div>
  );
}

export function AppointmentDisplay({
  app,
  baseHeight,
  displayAsLine,
}: {
  app: Haivy.Appointment;
  baseHeight: number;
  displayAsLine?: boolean;
}) {
  const selfRef = useRef<HTMLDivElement | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  const { status, duration, meeting_date, content } = app;

  const time = new Date(meeting_date || "");
  const hour = time.getHours();
  const minute = time.getMinutes();

  const endTime = addMinutes(time, duration);
  const displayStatus = status?.split("_").join(" ");

  const dur = (duration / 60) * baseHeight;
  const offsetHour = hour + minute / 60;

  function close() {
    setShowDetails(false);
  }

  function open() {
    setShowDetails(true);
  }

  useEffect(() => {
    if (status) return;

    selfRef.current?.scrollIntoView({
      block: "start",
      inline: "start",
    });
  }, [status, meeting_date]);

  const LineDisplay = () => (
    <div
      className={"line-apt-display " + status}
      style={{
        height: baseHeight,
        boxShadow: showDetails ? "var(--shadow)" : "",
      }}
      onClick={open}
    >
      <Tooltips text={"Status: " + displayStatus}>
        <div
          className="w-4 aspect-square rounded-full"
          style={{ backgroundColor: getStatusColor(status) }}
        ></div>
      </Tooltips>
      <div className="overflow-hidden whitespace-nowrap flex aictr gap-3">
        <div className="font-mono">
          <span>{DateUtils.format(time, "HH:mm")}</span>
          <span className="extra"> - </span>
          <span className="extra">
            {DateUtils.format(addMinutes(time, duration), "HH:mm")}
          </span>
        </div>
        <div className="font-semibold"> {content || "Unnamed appointment"}</div>
      </div>
    </div>
  );

  const BoxDisplay = () => (
    <div
      className="pl-2 p-1 text-white rounded-md overflow-hidden cursor-pointer text-md"
      ref={selfRef}
      style={{
        width: "calc(100% - 8px)",
        height: dur,

        top: `calc(100% + ${offsetHour * baseHeight}px)`,
        position: "absolute",
        zIndex: showDetails ? 1 : 0,

        backgroundColor: getStatusColor(status),
        fontSize: 11,

        transition: "all 0.1s",
        opacity: status === "cancelled" ? 0.5 : 1,
      }}
      tabIndex={0}
      onClick={open}
    >
      <div>
        <div
          className="font-semibold"
          style={{
            whiteSpace:
              dur <= 0.5 * baseHeight && !showDetails ? "nowrap" : "pre-wrap",
          }}
        >
          {content?.trim() || "Unnamed appointment"}
        </div>
        <span>
          {DateUtils.format(time, "k:mm")} - {DateUtils.format(endTime, "k:mm")}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div className={showDetails ? "active" : ""}>
        {displayAsLine ? <LineDisplay /> : <BoxDisplay />}
      </div>
      {!showDetails || <DetailCards details={app} close={close} />}
    </>
  );
}

export function TimelineRunner({ b, date }: { b: number; date: Date }) {
  if (!isToday(date)) return "";

  const cur = new Date();

  const h = getHours(cur);
  const m = getMinutes(cur);

  const timePassed = h + m / 60;

  return (
    <div
      className="border-t-1 h-0 border-red-600 z-2 flex aictr"
      style={{
        transform: `translateY(calc(100% + ${timePassed * b}px))`,
      }}
    >
      <Tooltips text={DateUtils.format(cur, "H:mm")}>
        <div className="w-3 h-3 bg-red-600 rounded-xl -ml-3"></div>
      </Tooltips>
    </div>
  );
}
