import { useEffect, useRef, useState } from "react";
import { addMinutes, format, getHours, getMinutes, isToday } from "date-fns";
import "./components.styles.css";

import { Tooltips } from "@components/base/others";
import { UserAutoInfo } from "@components/users";
import { Icon } from "@components/icons";

import { useDraggable } from "@hooks/helper";

import { getBestPosition } from "./test";
import type { Appointment } from "./type";
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

function ReadonlyContent({ details }: { details: Appointment }) {
  const statusState = useState(details.status || "");

  const date = new Date(details.meeting_date || "");
  const endDate = addMinutes(date, details.duration);

  function updateStatus() {}

  return (
    <>
      <div className="text-xl font-semibold mb-4 link link-hover px-4">
        {details.content || "Unnamed appointment"}
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
          <div>{details.content || "No information provided"}</div>
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
            />
          </div>
        </div>

        <div className="flex gap-3 mb-4 flex-1">
          <Icon name="person" size="1.5em" />
          <div className="flex-1">
            <div className="flex aictr spbtw my-1">
              <div>Patient: </div>
              <UserAutoInfo id={details.patient_id} />
            </div>
            <div className="flex aictr spbtw my-1">
              <div>Assigned to: </div>
              <UserAutoInfo id={details.staff_id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function DetailCards({
  details,
  close,
}: {
  details: Appointment;
  close: () => void;
}) {
  const { props, onMouseDown } = useDraggable("forward");
  const { style: oStyle, ...oRest } = props;

  function toggleEditMode() {}

  return (
    <div
      className="card bg-base-200 shadow-xl w-[360px] border-t-12"
      style={{
        borderColor: getStatusColor(details.status),
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

      <ReadonlyContent details={details} />
    </div>
  );
}

export function AppointmentDisplay({
  app,
  baseHeight,
  displayAsLine,
}: {
  app: Appointment;
  baseHeight: number;
  displayAsLine?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState<{ x: number; y: number; o: number }>({
    x: 0,
    y: 0,
    o: 0,
  });

  const [render, setRender] = useState(false);

  const time = new Date(app.meeting_date || "");
  const hour = time.getHours();

  const dur = (app.duration / 60) * baseHeight;

  function close() {
    setPos((a) => ({ ...a, o: 0 }));
    setTimeout(() => setRender(false), 100);
  }

  function open(e: React.MouseEvent) {
    if (render) {
      return close();
    }

    setPos({ x: e.clientX, y: e.clientY, o: 0 });
    setRender(true);
  }

  useEffect(() => {
    if (!render) return;

    const timeout = setTimeout(() => {
      setPos((a) => {
        const b = getBestPosition(a.y, a.x, ref.current);
        return { x: b.left, y: b.top, o: 1 };
      });
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [render]);

  const endTime = addMinutes(time, app.duration);
  const status = app.status?.split("_").join(" ");

  const LineDisplay = () => (
    <div
      className="line-apt-display"
      style={{ height: baseHeight, boxShadow: render ? "var(--shadow)" : "" }}
      onClick={open}
    >
      <Tooltips text={"Status: " + status}>
        <div
          className="w-4 aspect-square rounded-full"
          style={{ backgroundColor: getStatusColor(app.status) }}
        ></div>
      </Tooltips>
      <div className="overflow-hidden whitespace-nowrap flex aictr gap-3">
        <div>
          <span>{format(time, "kk:mm")}</span>
          <span className="extra"> - </span>
          <span className="extra">
            {format(addMinutes(time, app.duration), "kk:mm")}
          </span>
        </div>
        <div className="font-semibold"> {app.content}</div>
      </div>
    </div>
  );

  const BoxDisplay = () => (
    <div
      className="pl-2 p-1 text-white rounded-md overflow-hidden cursor-pointer hover:shadow-xl"
      style={{
        width: "calc(100% - 8px)",
        height: pos.o ? "fit-content" : dur,

        top: `calc(100% + ${hour * baseHeight}px)`,
        position: "absolute",
        zIndex: render ? 1 : 0,

        backgroundColor: getStatusColor(app.status),
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
          {app.content || "Unnamed appointment"}
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
        ref={ref}
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
