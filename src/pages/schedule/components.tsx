import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { addMinutes, format, getHours, getMinutes, isToday } from "date-fns";
import "./components.styles.css";

import { StatusBadge } from "@components/features/tickets";
import { Button, IconButton } from "@components/shared/buttons";
import { Tooltip } from "@components/shared/tooltip";
import { UserInfo } from "@components/shared/users";
import { Icon } from "@components/icons/google";

import useDraggable from "@hooks/useDraggable";
import useNav from "@hooks/useNav";

import { StatusColor } from "@utils/data";

import { useSchedulePanel } from "./staff";
import { getBestPosition } from "./test";

export function DetailCards({
  details,
  close,
}: {
  details: Haivy.Appointment;
  close: () => void;
}) {
  const nav = useNav();

  const { props, onMouseDown, ref } = useDraggable("forward");
  const { style: oStyle, ...oRest } = props;

  const statusState = useState(details.status || "");

  const date = new Date(details.meeting_date || "");
  const endDate = addMinutes(date, details.duration);

  const status = statusState[0];

  function viewDetails() {
    nav("/appointments/" + details.appointment_id);
  }

  return (
    <div
      className="card bg-base-200 shadow-xl min-w-[360px] border-t-12 max-w-[40vw] z-10"
      style={{ borderColor: StatusColor[status], ...oStyle }}
      onClick={(e) => e.stopPropagation()}
      ref={ref}
      {...oRest}
    >
      <div className="flex spbtw h-15 p-2">
        <div className="btn w-8 h-8 cursor-grab" onMouseDown={onMouseDown}>
          <Icon name="drag_handle" size="1.2em" />
        </div>

        <IconButton name="Close" icon="close" onClick={close} />
      </div>

      <div className="text-lg font-semibold mb-4 link link-hover px-4">
        {details.content?.trim() || "Unnamed appointment"}
      </div>

      <div className="text-sm px-4 w-full">
        <div className="flex aictr gap-4 mb-2">
          <Icon name="schedule" size="1.5em" />
          <div>
            <div>{format(date, "PPPP")}</div>
            <div>
              {format(date, "kk:mm")} - {format(endDate, "kk:mm")}
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

        <div className="flex aictr spbtw">
          <div className="flex aictr gap-4">
            <Icon name="door_open" />
            Meeting type
          </div>
          <div>{details.is_online ? "Online" : "Offline"}</div>
        </div>
      </div>

      {[null, "no_show", "pending", "cancelled"].includes(details.status) || (
        <Button className="m-2" onClick={viewDetails}>
          View appointment details
        </Button>
      )}
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
  let isInSchedulePanel = true;

  try {
    useSchedulePanel();
  } catch {
    isInSchedulePanel = false;
  }

  const detailBoxRef = useRef<HTMLDivElement | null>(null);
  const selfRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const [pos, setPos] = useState<{ x: number; y: number; o: number }>({
    x: 0,
    y: 0,
    o: 0,
  });

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
    setPos((a) => ({ ...a, o: 0 }));
    setTimeout(() => setShowDetails(false), 100);
  }

  function open(e: React.MouseEvent) {
    if (!isInSchedulePanel) {
      const date = format(time, "yyyy-M-dd");
      navigate(`/schedule?view=schedule&date=${date}`);
      return;
    }

    if (!status) return;
    if (showDetails) return close();

    setPos({ x: e.clientX, y: e.clientY, o: 0 });
    setShowDetails(true);
  }

  useEffect(() => {
    if (!showDetails) return;

    const timeout = setTimeout(() => {
      setPos((a) => {
        const b = getBestPosition(a.y, a.x, detailBoxRef.current);
        return { x: b.left, y: b.top, o: 1 };
      });
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [showDetails]);

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
      <Tooltip title={"Status: " + displayStatus}>
        <div
          className="w-4 aspect-square rounded-full"
          style={{ backgroundColor: StatusColor[status || ""] }}
        ></div>
      </Tooltip>
      <div className="overflow-hidden whitespace-nowrap flex aictr gap-3">
        <div className="font-mono">
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
      className="pl-2 p-1 text-white rounded-md overflow-hidden cursor-pointer text-md"
      ref={selfRef}
      style={{
        width: "calc(100% - 8px)",
        height: pos.o ? "fit-content" : dur,

        top: `calc(100% + ${offsetHour * baseHeight}px)`,
        position: "absolute",
        zIndex: showDetails ? 1 : 0,

        backgroundColor: StatusColor[status || ""],
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
          {format(time, "kk:mm")} - {format(endTime, "kk:mm")}
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
      <div className={showDetails ? "active" : ""}>
        {displayAsLine ? <LineDisplay /> : <BoxDisplay />}
      </div>
      {!showDetails || <DetailBoxWrapper />}
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
      <Tooltip title={format(cur, "kk:mm")}>
        <div className="w-3 h-3 bg-red-600 rounded-xl -ml-3"></div>
      </Tooltip>
    </div>
  );
}
