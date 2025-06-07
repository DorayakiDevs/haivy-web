import { useEffect, useRef, useState } from "react";
import { addMinutes, format, getHours, getMinutes, isToday } from "date-fns";
import "./components.styles.css";

import { Tooltips } from "@components/base/others";
import { UserAutoInfo } from "@components/users";
import { Icon } from "@components/icons";

import { useDraggable } from "@hooks/helper";

import { getBestPosition } from "./test";
import { SelectOptions } from "@components/base/select";

export function getStatusColor(status: string | null): string {
  switch (status) {
    case "pending":
      return "#d97706";
    case "scheduled":
      return "#1d4ed8";
    case "in_progress":
      return "#3730a3";
    case "completed":
      return "#047857";
    case "canceled":
      return "#9f1239";
    case "no_show":
      return "#374151";
    case "ghost":
      return "#888888";
    default:
      return "var(--color-primary)";
  }
}

function StatusBadge({ s }: { s: string | null }) {
  return (
    <div
      className="badge badge-ghost badge-sm capitalize"
      style={{ background: getStatusColor(s), color: "var(--color-white)" }}
    >
      {s?.replace("_", " ")}
    </div>
  );
}

export function DetailCards({
  details,
  close,
}: {
  details: Haivy.Appointment;
  close: () => void;
}) {
  const { props, onMouseDown } = useDraggable("forward");
  const { style: oStyle, ...oRest } = props;

  const statusState = useState(details.status || "");

  const date = new Date(details.meeting_date || "");
  const endDate = addMinutes(date, details.duration);

  const status = statusState[0];

  function toggleEditMode() {}

  return (
    <div
      className="card bg-base-200 shadow-xl min-w-[360px] border-t-12"
      style={{
        borderColor: getStatusColor(status),
        ...oStyle,
      }}
      {...oRest}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex spbtw h-15 p-2">
        <div className="btn w-8 h-8 cursor-grab" onMouseDown={onMouseDown}>
          <Icon name="drag_handle" size="1.2em" />
        </div>

        <div className="gap-1">
          <Tooltips text="Edit">
            <button className="btn btn-ghost w-8 h-8" onClick={toggleEditMode}>
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

      <div className="text-xl font-semibold mb-4 link link-hover px-4">
        {details.content?.trim() || "Unnamed appointment"}
      </div>

      <div className="text-sm px-4 w-full">
        <div className="flex aictr gap-3 mb-2">
          <Icon name="schedule" size="1.5em" />
          <div>
            <div>{format(date, "PPPP")}</div>
            <div>
              {format(date, "K:mm")} - {format(endDate, "K:mm")}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <Icon name="subject" size="1.5em" />
          <div>{details.content?.trim() || "No information provided"}</div>
        </div>

        <div className="flex gap-3 mb-4">
          <Icon name="info" size="1.5em" />
          <div className="flex aictr spbtw flex-1">
            Status:
            <SelectOptions
              options={[
                "pending",
                "scheduled",
                "in_progress",
                "completed",
                "canceled",
                "no_show",
              ].map((s) => ({
                text: <StatusBadge s={s} />,
                value: s,
              }))}
              state={statusState}
              closeOnClick
              direction="bottom right"
            />
          </div>
        </div>

        <div className="flex gap-3 mb-4 flex-1">
          <Icon name="person" size="1.5em" />
          <div className="flex-1">
            <div className="flex aictr spbtw gap-4 my-1">
              <div>Patient: </div>
              <UserAutoInfo id={details.patient_id} hideAvatar roleCount={0} />
            </div>
            <div className="flex aictr spbtw gap-4 my-1">
              <div>Assigned to: </div>
              <UserAutoInfo id={details.staff_id} hideAvatar roleCount={0} />
            </div>
          </div>
        </div>
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
  const detailBoxRef = useRef<HTMLDivElement | null>(null);
  const selfRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState<{ x: number; y: number; o: number }>({
    x: 0,
    y: 0,
    o: 0,
  });

  const [render, setRender] = useState(false);

  const { status, duration, meeting_date, content } = app;

  const time = new Date(meeting_date || "");
  const hour = time.getHours();
  const minute = time.getMinutes();

  const endTime = addMinutes(time, duration);
  const displayStatus = status?.split("_").join(" ");

  const dur = (duration / 60) * baseHeight;

  const offsetHour = hour + minute / 60;

  function close() {
    setPos((a) => ({ ...a, o: 0 }));
    setTimeout(() => setRender(false), 100);
  }

  function open(e: React.MouseEvent) {
    if (!status) return;
    if (render) return close();

    setPos({ x: e.clientX, y: e.clientY, o: 0 });
    setRender(true);
  }

  useEffect(() => {
    if (!render) return;

    const timeout = setTimeout(() => {
      setPos((a) => {
        const b = getBestPosition(a.y, a.x, detailBoxRef.current);
        return { x: b.left, y: b.top, o: 1 };
      });
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [render]);

  useEffect(() => {
    if (!status) return;

    selfRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, [status, meeting_date]);

  const LineDisplay = () => (
    <div
      className="line-apt-display"
      style={{ height: baseHeight, boxShadow: render ? "var(--shadow)" : "" }}
      onClick={open}
    >
      <Tooltips text={"Status: " + displayStatus}>
        <div
          className="w-4 aspect-square rounded-full"
          style={{ backgroundColor: getStatusColor(status) }}
        ></div>
      </Tooltips>
      <div className="overflow-hidden whitespace-nowrap flex aictr gap-3">
        <div>
          <span>{format(time, "kk:mm")}</span>
          <span className="extra"> - </span>
          <span className="extra">
            {format(addMinutes(time, duration), "kk:mm")}
          </span>
        </div>
        <div className="font-semibold"> {content || "Unnamed appointment"}</div>
      </div>
    </div>
  );

  const BoxDisplay = () => (
    <div
      className="pl-2 p-1 text-white rounded-md overflow-hidden cursor-pointer hover:shadow-xl"
      ref={selfRef}
      style={{
        width: "calc(100% - 8px)",
        height: pos.o ? "fit-content" : dur,

        top: `calc(100% + ${offsetHour * baseHeight}px)`,
        position: "absolute",
        zIndex: render ? 1 : 0,

        backgroundColor: getStatusColor(status),
        fontSize: 11,

        transition: "all 0.1s",
      }}
      tabIndex={0}
      onClick={open}
    >
      <div>
        <div
          className="font-semibold"
          style={{
            whiteSpace:
              dur <= 0.5 * baseHeight && !render ? "nowrap" : "pre-wrap",
          }}
        >
          {content?.trim() || "Unnamed appointment"}
        </div>
        <span>
          {format(time, "k:mm")} - {format(endTime, "k:mm")}
        </span>
      </div>
    </div>
  );

  const DetailBoxWrapper = () => (
    <div className="fixed z-5 top-0 left-0 w-full h-full" onClick={close}>
      <div
        className="absolute transition-opacity"
        style={{
          top: pos.y,
          left: pos.x,
          opacity: pos.o,
        }}
        ref={detailBoxRef}
      >
        <DetailCards details={app} close={close} />
      </div>
    </div>
  );

  return (
    <>
      {displayAsLine ? <LineDisplay /> : <BoxDisplay />}
      {!render || <DetailBoxWrapper />}
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
      <Tooltips text={format(new Date(), "H:mm:ss")}>
        <div className="w-3 h-3 bg-red-600 rounded-xl -ml-3"></div>
      </Tooltips>
    </div>
  );
}
