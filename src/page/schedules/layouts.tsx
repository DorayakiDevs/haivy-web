import {
  addDays,
  format,
  getDaysInMonth,
  getMonth,
  getYear,
  isToday,
} from "date-fns";
import { Helmet } from "react-helmet-async";

import { CelebrateButton } from "@components/base/button";
import { Icon } from "@components/icons";

import { formatMonthYearRanges } from "@utils/date";

import { AppointmentDisplay } from "./components";
import { TimelineRunner } from "./components";

import { useSchedule } from ".";

export function ColumnView({
  dates,
  baseHeight,
}: {
  dates: Date[];
  baseHeight: number;
}) {
  const { appointments, setViewDateParams } = useSchedule();

  function handleBlockClick(d: Date) {
    return () => {
      setViewDateParams("day", d);
    };
  }

  const title = formatMonthYearRanges(dates);

  return (
    <div className="w-full h-full overflow-auto relative key-fade-in">
      <Helmet>
        <title>Haivy | Schedule - {title}</title>
      </Helmet>
      <div className="flex sticky top-0 z-3 bg-base-200 text-primary">
        <div className="w-12"></div>
        {dates.map((date) => {
          const today = isToday(date);

          return (
            <div
              className="flex-1 flex coll aictr jcctr h-20 border-x-1 border-[#fff2] gap-1"
              key={date.toISOString()}
            >
              <div className="uppercase text-xs">{format(date, "EEE")}</div>
              <div
                onClick={handleBlockClick(date)}
                className={[
                  "text-2xl w-12 h-12 rounded-full btn btn-ghost btn-primary",
                  today ? "btn-active" : "",
                ].join(" ")}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="col">
        <div className="h-60 flex pl-12 -mt-50">
          {dates.map((date) => {
            const currentDate = date.toLocaleDateString();

            const apps = appointments.filter((a) => {
              if (!a.meeting_date) return false;

              const d = new Date(a.meeting_date);
              return d.toLocaleDateString() === currentDate;
            });

            return (
              <div
                className="flex-1 flex coll jcend relative"
                key={date.toISOString()}
              >
                <TimelineRunner b={baseHeight} date={date} />
                {apps.map((app) => (
                  <AppointmentDisplay
                    app={app}
                    baseHeight={baseHeight}
                    key={app.appointment_id}
                  />
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
                <div
                  className="flex-1 flex"
                  style={{ height: baseHeight }}
                  key={i}
                >
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
                    {dates.map((_, i) => [
                      <div
                        className="flex-1 border-r-1 flex coll pr-4"
                        style={{ borderColor: "#0001" }}
                        key={i}
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
  const { appointments, viewDate, setViewDateParams } = useSchedule();

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

  const dates = Array(14)
    .fill(0)
    .map((_, i) => {
      return addDays(viewDate, i);
    });

  function handleDayClick(d: Date) {
    return () => setViewDateParams("day", d);
  }

  return (
    <div className="key-fade-in overflow-y-auto">
      {dates.map((date) => {
        return (
          <div
            key={date.toISOString()}
            className="flex gap-2 border-b-1 py-2"
            style={{ borderColor: "#0001" }}
          >
            <div className="flex aictr gap-2 w-46">
              <div
                className={
                  "btn btn-ghost w-14 h-14 btn-circle" +
                  (isToday(date) ? " btn-active btn-primary" : "")
                }
                onClick={handleDayClick(date)}
              >
                <div> {date.getDate()}</div>
              </div>
              <div className="uppercase text-xs font-semibold">
                {format(date, "MMM, E")}
              </div>
            </div>
            <div className="min-h-6 flex-1">
              {appointments
                .filter((a) => {
                  if (!a.meeting_date) return false;

                  const md = new Date(a.meeting_date);
                  return date.toLocaleDateString() === md.toLocaleDateString();
                })
                .map((a) => {
                  return (
                    <AppointmentDisplay
                      displayAsLine
                      app={a}
                      baseHeight={32}
                      key={a.appointment_id}
                    />
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function GridView({ date }: { date: Date }) {
  const { setViewDateParams, appointments } = useSchedule();

  const month = getMonth(date);
  const year = getYear(date);

  const dayCount = getDaysInMonth(month);
  const displayCount = dayCount; //35;
  const firstDate = new Date(year, month, 1);

  const dates = new Array(displayCount).fill(0).map((_, offset) => {
    return addDays(firstDate, offset);
  });

  const title = formatMonthYearRanges(dates.slice(dayCount));

  function handleDateClick(d: Date) {
    return () => {
      setViewDateParams("day", d);
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
      {dates.slice(0, 7).map((d, i) => {
        return (
          <div
            className="flex aictr jcctr bg-primary text-primary-content"
            key={i}
          >
            <span className="text-xs uppercase"> {format(d, "EEE")}</span>
          </div>
        );
      })}
      {dates.map((date) => {
        return (
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              filter: getMonth(date) === month ? "" : "brightness(0.95)",
              backgroundColor: "#fff",
              transition: "all 0.1s",
            }}
            key={date.toISOString()}
          >
            <div className="absolute px-4 py-2 text-xs font-light cursor-pointer">
              {isToday(date) ? (
                <div
                  className="w-7 h-7 btn btn-circle btn-primary btn-active"
                  onClick={handleDateClick(date)}
                >
                  {date.getDate()}
                </div>
              ) : (
                <div
                  className="w-7 h-7 btn btn-circle btn-ghost btn-primary"
                  onClick={handleDateClick(date)}
                >
                  {date.getDate()}
                </div>
              )}
            </div>

            <div className="mt-9">
              {appointments
                .filter((a) => {
                  if (!a.meeting_date) return false;

                  const md = new Date(a.meeting_date);
                  return date.toLocaleDateString() === md.toLocaleDateString();
                })
                .map((a) => {
                  return (
                    <AppointmentDisplay
                      displayAsLine
                      app={a}
                      baseHeight={26}
                      key={a.appointment_id}
                    />
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
