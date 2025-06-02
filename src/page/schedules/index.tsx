import { createContext, useContext } from "react";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";

import {
  addDays,
  addMonths,
  format,
  isToday,
  isValid,
  setDate,
} from "date-fns";

import { SelectOptions } from "@components/base/select";
import { Icon } from "@components/icons";

import { useAppointmentList } from "@services/data/appointments";
import type { DatabaseColType } from "@services/global";

import { FullscreenLoading } from "@pages/others/loading";

import { formatMonthYearRanges, getWeekFromDate } from "@utils/date";

import { ColumnView, GridView, ScheduleListView } from "./layouts";

type Appointment = DatabaseColType<"appointment">;

type T_ScheduleContext = {
  appointments: Appointment[];
  viewDate: Date;

  setViewType: (a: string) => void;
  setParamDate: (d: Date) => void;
};

const ScheduleContext = createContext<T_ScheduleContext | null>(null);

export function useSchedule() {
  const data = useContext(ScheduleContext);
  if (data) return data;
  throw new Error("Missng context");
}

export default function SchedulePage() {
  const [params, setSeachParam] = useSearchParams();
  const dateStrParam = params.get("date") || "";
  const viewType = params.get("view") || "day";

  function setViewType(a: string) {
    if (viewType === a) {
      return;
    }

    setSeachParam((prev) => {
      prev.set("view", a);
      return prev;
    });
  }

  function setParamDate(d: Date) {
    const str = format(d, "yyyy-M-dd");

    if (dateStrParam === str) {
      return;
    }

    setSeachParam((prev) => {
      prev.set("date", str);
      return prev;
    });
  }

  // * Fetching date from parameter
  let viewDate = new Date(dateStrParam);

  if (!isValid(viewDate)) {
    viewDate = new Date();
  }
  //* ----

  const data = useAppointmentList("2020-1-01", "2026-1-01");
  if (data.status !== "success") {
    return <FullscreenLoading />;
  }

  const appointments = data.data;

  function goToday() {
    setParamDate(new Date());
  }

  let nextDate = addDays(viewDate, 1);
  let prevDate = addDays(viewDate, -1);

  switch (viewType) {
    case "schedule": {
      nextDate = addDays(viewDate, 14);
      prevDate = addDays(viewDate, -14);

      break;
    }

    case "week": {
      nextDate = addDays(viewDate, 7);
      prevDate = addDays(viewDate, -7);

      break;
    }

    case "month": {
      nextDate = setDate(addMonths(viewDate, 1), 1);
      prevDate = setDate(addMonths(viewDate, -1), 1);

      break;
    }
  }

  function navigatePrev() {
    setParamDate(prevDate);
  }

  function navigateNext() {
    setParamDate(nextDate);
  }

  function getTitle() {
    switch (viewType) {
      case "month":
      case "day": {
        return format(viewDate, "MMMM yyyy");
      }

      case "week": {
        return formatMonthYearRanges(getWeekFromDate(viewDate));
      }
    }
  }

  const value = {
    appointments,
    viewDate,

    setViewType,
    setParamDate,
  };

  return (
    <ScheduleContext.Provider value={value}>
      <Helmet>
        <title>Haivy | Schedule</title>
      </Helmet>
      <div className="content-wrapper flex coll">
        <div className="py-4 flex aictr gap-6">
          <button
            className={[
              "btn btn-outline btn-primary px-8 py-6 rounded-full",
              isToday(viewDate) ? "btn-disabled" : "",
            ].join(" ")}
            onClick={goToday}
          >
            Today
          </button>

          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={navigatePrev}>
              <Icon name="chevron_left" />
            </button>
            <button className="btn btn-ghost" onClick={navigateNext}>
              <Icon name="chevron_right" />
            </button>
          </div>

          <div className="text-2xl font-semibold flex-1">{getTitle()}</div>

          <button className="btn btn-primary py-4">
            <Icon name="add" />
            Create
          </button>

          <SelectOptions
            options={[
              {
                value: "day",
                text: (
                  <div className="flex aictr gap-2">
                    <Icon name="calendar_view_day" />
                    Day
                  </div>
                ),
              },
              {
                value: "week",
                text: (
                  <div className="flex aictr gap-2">
                    <Icon name="calendar_view_week" />
                    Week
                  </div>
                ),
              },
              {
                value: "month",
                text: (
                  <div className="flex aictr gap-2">
                    <Icon name="calendar_view_month" />
                    Month
                  </div>
                ),
              },
              {
                value: "schedule",
                text: (
                  <div className="flex aictr gap-2">
                    <Icon name="view_agenda" />
                    Schedule
                  </div>
                ),
              },
            ]}
            direction="bottom end"
            closeOnClick
            state={[viewType, setViewType]}
          />
        </div>

        {(() => {
          switch (viewType) {
            case "day":
              return <CalendarViewDay />;

            case "month":
              return <CalendarViewMonth />;

            case "schedule":
              return <CalendarViewList />;

            case "week":
              return <CalendarViewWeek />;

            default:
              return <CalendarViewDay />;
          }
        })()}
      </div>
    </ScheduleContext.Provider>
  );
}

function CalendarViewWeek() {
  const { viewDate } = useSchedule();
  const days = getWeekFromDate(viewDate);

  return <ColumnView days={days} baseHeight={60} />;
}

function CalendarViewDay() {
  const { viewDate } = useSchedule();

  const days = [viewDate];

  return <ColumnView days={days} baseHeight={100} />;
}

function CalendarViewMonth() {
  const { viewDate } = useSchedule();

  return <GridView date={viewDate} />;
}

function CalendarViewList() {
  return <ScheduleListView />;
}
