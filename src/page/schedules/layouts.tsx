import {
  addDays,
  format,
  getDaysInMonth,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  isToday,
} from "date-fns";
import { Helmet } from "react-helmet-async";

import { CelebrateButton } from "@components/base/button";
import { AppointmentDisplay } from "./components";
import { Icon } from "@components/icons";

import { formatMonthYearRanges } from "@utils/date";

import { useSchedule } from ".";
import { Tooltips } from "@components/base/others";

function TimelineRunner({ b, day }: { b: number; day: Date }) {
  if (!isToday(day)) return "";

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

export function ColumnView({
  days,
  baseHeight,
}: {
  days: Date[];
  baseHeight: number;
}) {
  const { appointments, setViewType, setParamDate } = useSchedule();

  function handleBlockClick(d: Date) {
    return () => {
      setViewType("date");
      setParamDate(d);
    };
  }

  const title = formatMonthYearRanges(days);

  return (
    <div className="w-full h-full overflow-auto relative key-fade-in">
      <Helmet>
        <title>Haivy | Schedule - {title}</title>
      </Helmet>
      <div className="flex sticky top-0 z-3 bg-base-200 text-primary">
        <div className="w-12"></div>
        {days.map((day) => {
          const today = isToday(day);

          return (
            <div className="flex-1 flex coll aictr jcctr h-20 border-x-1 border-[#fff2] gap-1">
              <div className="uppercase text-xs">{format(day, "EEE")}</div>
              <div
                onClick={handleBlockClick(day)}
                className={[
                  "text-2xl w-12 c-12 rounded-full btn btn-ghost btn-primary",
                  today ? "btn-active" : "",
                ].join(" ")}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="col">
        <div className="h-60 flex pl-12 -mt-50">
          {days.map((date) => {
            const currentDate = date.toLocaleDateString();

            const apps = appointments.filter((a) => {
              if (!a.meeting_date) return false;

              const d = new Date(a.meeting_date);
              return d.toLocaleDateString() === currentDate;
            });

            return (
              <div className="flex-1 flex coll jcend relative">
                <TimelineRunner b={baseHeight} day={date} />
                {apps.map((app) => (
                  <AppointmentDisplay app={app} baseHeight={baseHeight} />
                ))}
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none">
          {Array(24)
            .fill(0)
            .map((_, i) => {
              return (
                <div className="flex-1 flex" style={{ height: baseHeight }}>
                  <div
                    className="text-xs w-12 border-r-1"
                    style={{ lineHeight: 0, borderColor: "#0001" }}
                  >
                    {i.toString().padStart(2, "0")}:00
                  </div>
                  <div
                    className="border-t-1 flex-1 flex"
                    style={{ borderColor: "#0001" }}
                  >
                    {days.map(() => [
                      <div
                        className="flex-1 border-r-1 flex coll pr-4"
                        style={{ borderColor: "#0001" }}
                      ></div>,
                    ])}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export function ScheduleListView() {
  const { appointments } = useSchedule();

  if (!appointments.length) {
    return (
      <div className="flex aictr jcctr h-full coll gap-8">
        <Icon name="celebration" size="6em" />
        <div className="text-xl font-bold">
          You currently have no appointment incoming!
        </div>
        <CelebrateButton />
      </div>
    );
  }

  return <div className="key-fade-in">Schedule agenda list</div>;
}

export function GridView({ date }: { date: Date }) {
  const { setViewType, setParamDate, appointments } = useSchedule();

  const month = getMonth(date);
  const year = getYear(date);

  const dayCount = getDaysInMonth(month);
  const displayCount = dayCount; //35;
  const firstDate = new Date(year, month, 1);

  const days = new Array(displayCount).fill(0).map((_, offset) => {
    return addDays(firstDate, offset);
  });

  const title = formatMonthYearRanges(days.slice(dayCount));

  function handleDateClick(d: Date) {
    return () => {
      setViewType("date");
      setParamDate(d);
    };
  }

  return (
    <div
      className="h-full my-2 rounded-2xl border-2 key-fade-in"
      style={{
        display: "grid",
        gridTemplateRows: "50px repeat(5, 1fr)",
        gridTemplateColumns: "repeat(7, 1fr)",
        overflow: "hidden",
        borderColor: "#0002",
        gap: 1,
      }}
    >
      <Helmet>
        <title>Haivy | Schedule - {title}</title>
      </Helmet>
      {days.slice(0, 7).map((d) => {
        return (
          <div className="flex aictr jcctr bg-primary text-primary-content">
            <span className="text-xs uppercase"> {format(d, "EEE")}</span>
          </div>
        );
      })}
      {days.map((d) => {
        return (
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              filter: getMonth(d) === month ? "" : "brightness(0.95)",
              backgroundColor: "#fff",
              transition: "all 0.1s",
            }}
          >
            <div className="absolute px-4 py-2 text-xs font-light cursor-pointer">
              {isToday(d) ? (
                <div
                  className="w-7 h-7 btn btn-circle btn-primary btn-active"
                  onClick={handleDateClick(d)}
                >
                  {d.getDate()}
                </div>
              ) : (
                <div
                  className="w-7 h-7 btn btn-circle btn-ghost btn-primary"
                  onClick={handleDateClick(d)}
                >
                  {d.getDate()}
                </div>
              )}
            </div>

            <div className="mt-9">
              {appointments
                .filter((a) => {
                  if (!a.meeting_date) return false;

                  const md = new Date(a.meeting_date);
                  return d.toLocaleDateString() === md.toLocaleDateString();
                })
                .map((a) => {
                  return (
                    <AppointmentDisplay displayAsLine app={a} baseHeight={0} />
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
