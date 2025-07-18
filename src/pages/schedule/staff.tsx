import { createContext, useContext, useEffect, useState } from "react";
import {
  addDays,
  addMonths,
  format,
  isToday,
  isValid,
  setDate,
} from "date-fns";
import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";

import FullscreenLoading from "@pages/others/loading";

import { SelectOptions } from "@components/shared/select";
import { Icon } from "@components/icons/google";

import useUI from "@hooks/useUI";

import { formatMonthYearRanges, getWeekFromDate, stamp } from "@utils/date";

import { ColumnView, GridView, ScheduleListView } from "./layouts";
import { AppointmentExternalPanel } from "./panels";
import { adjustTimeToLocal } from "./utils";
import { useServices } from "@services/index";

type T_ScheduleContext = {
  appointments: Haivy.Appointment[];
  viewDate: Date;

  setViewType: (a: string) => void;
  setParamDate: (d: Date) => void;
  setViewDateParams(v: string | null, d: Date | null, replace?: boolean): void;

  setGhostAppointment(a: Partial<Haivy.Appointment> | null): void;
  reload(): void;
};

const ScheduleContext = createContext<T_ScheduleContext | null>(null);

export function useSchedulePanel() {
  const data = useContext(ScheduleContext);
  if (data) return data;

  throw new Error("Missing context");
}

export default function StaffSchedulePage() {
  return <SchedulePageButWithoutProvider />;
}

function SchedulePageButWithoutProvider() {
  const { client } = useServices();
  const { sidePanel } = useUI();

  const [params, setSeachParam] = useSearchParams();

  const [ghostApt, setGhostApt] = useState<Haivy.Appointment | null>(null);

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [_stamp, setStamp] = useState(stamp());

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);

      const { data, error } = await client
        .rpc("get_doctor_schedule_in_range", {
          begin_date: "2010-01-01",
          end_date: "2100-01-01",
        })
        .abortSignal(controller.signal);

      if (controller.signal.aborted) {
        return setLoading(true);
      }

      if (error) {
        console.error(error);
        return;
      }

      setData(data as any);
      setLoading(false);
    }

    load();

    return () => {
      controller.abort();
    };
  }, [_stamp]);

  const dateStrParam = params.get("date") || "";
  const viewType = params.get("view") || "month";

  function setViewType(v: string) {
    setViewDateParams(v, null);
  }

  function setParamDate(d: Date) {
    setViewDateParams(null, d);
  }

  function setViewDateParams(
    view: string | null,
    d: Date | null,
    replace = false
  ) {
    let newView = viewType;
    let newDate = dateStrParam;

    if (view !== null && view !== newView) {
      newView = view;
    }

    if (d !== null && format(d, "yyyy-M-dd") !== newDate) {
      newDate = format(d, "yyyy-M-dd");
    }

    setSeachParam(
      (prev) => {
        prev.set("date", newDate);
        prev.set("view", newView);
        return prev;
      },
      { replace: replace }
    );
  }

  // * Fetching date from parameter
  let viewDate = new Date(dateStrParam);

  if (!isValid(viewDate)) {
    console.log("Date", viewDate, "is not valid");
    viewDate = new Date();
  }
  //* ----

  if (loading) {
    return <FullscreenLoading />;
  }

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

      case "schedule": {
        return formatMonthYearRanges(
          Array(14)
            .fill(0)
            .map((_, i) => {
              return addDays(viewDate, i);
            })
        );
      }

      default: {
        return "Agenda";
      }
    }
  }

  function setGhostAppointment(apt: Partial<Haivy.Appointment> | null) {
    setGhostApt(apt as Haivy.Appointment);
  }

  function openCreatePanel() {
    sidePanel.open("ext_apt");
  }

  const appointments = [...adjustTimeToLocal(data)];

  if (ghostApt) {
    appointments.push(ghostApt);
  }

  const value = {
    appointments,
    viewDate,

    setViewType,
    setParamDate,
    setViewDateParams,

    setGhostAppointment,
    reload() {
      setStamp(stamp());
    },
  };

  return (
    <ScheduleContext.Provider value={value}>
      <Helmet>
        <title>Haivy | Schedule</title>
      </Helmet>
      <div className="content-wrapper flex flex-row-reverse">
        <AppointmentExternalPanel />

        <div className="flex coll h-full flex-1">
          <div className="py-3 flex aictr gap-6 pr-8">
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

            <div className="text-xl font-semibold flex-1">{getTitle()}</div>

            <button className="btn btn-primary py-4" onClick={openCreatePanel}>
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
                      <div>Schedule</div>
                    </div>
                  ),
                },
              ]}
              direction="bottom right"
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
      </div>
    </ScheduleContext.Provider>
  );
}

function CalendarViewWeek() {
  const { viewDate } = useSchedulePanel();
  const dates = getWeekFromDate(viewDate);

  return <ColumnView dates={dates} baseHeight={124} />;
}

function CalendarViewDay() {
  const { viewDate } = useSchedulePanel();

  const days = [viewDate];

  return <ColumnView dates={days} baseHeight={100} />;
}

function CalendarViewMonth() {
  const { viewDate } = useSchedulePanel();

  return <GridView date={viewDate} />;
}

function CalendarViewList() {
  return <ScheduleListView />;
}
