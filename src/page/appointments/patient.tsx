import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { compareAsc, isToday } from "date-fns";

import { PostgrestError } from "@supabase/supabase-js";

import { LoadingIcon } from "@components/icons/others";
import { getStatusColor, StatusBadge } from "@components/base/badge";
import { ActionCard } from "@components/base/card";
import { Icon } from "@components/icons";

import { executeDbRPC } from "@services/rpc/base";
import { useClient } from "@services/client";

import { DateUtils } from "@utils/date";

import { RequestAppointmentDialog } from "../schedules/dialogs";
import { adjustTimeToLocal } from "../schedules/utils";

type T_RetType = any[];

const EmptyBox = {
  className:
    "h-46 flex aictr jcctr coll gap-2 border-2 border-dashed rounded-lg",
  style: { borderColor: "#0002" },
};

export function PatientAppointmentsPage() {
  return (
    <div className="content-wrapper pr-8 overflow-y-auto">
      <Helmet>
        <title>Haivy | My Appointments</title>
      </Helmet>
      <div className="py-8">
        <div>Schedule</div>
        <div className="font-bold text-2xl">My Appointments</div>
      </div>
      <PageContent name="get_patient_schedule_in_range" />
    </div>
  );
}

export function DoctorAppointmentsPage() {
  return (
    <div className="content-wrapper pr-8 overflow-y-auto">
      <Helmet>
        <title>Haivy | My Appointments</title>
      </Helmet>
      <div className="py-8">
        <div>Schedule</div>
        <div className="font-bold text-2xl">My Appointments</div>
      </div>
      <PageContent name="get_patient_schedule_in_range" />
    </div>
  );
}

function PageContent({
  name,
}: {
  name: "get_patient_schedule_in_range" | "get_doctor_schedule_in_range";
}) {
  const { supabase } = useClient();
  const requestPan = useState(false);

  const [timestamp, setTimestamp] = useState(new Date().getTime());
  const [apts, setAppointments] = useState<T_RetType>([]);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(false);

  function reload() {
    setTimestamp(new Date().getTime());
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetch() {
      setLoading(true);

      const { data, error } = await executeDbRPC(supabase, name, {
        p_begin_date: "2000-01-01",
        p_end_date: "2100-01-01",
      }).abortSignal(controller.signal);

      setError(error || null);

      setAppointments(adjustTimeToLocal((data || []) as any));
      setLoading(false);
    }

    setError(null);
    setAppointments([]);
    fetch();

    return () => {
      controller.abort("Reloading");
    };
  }, [timestamp]);

  if (loading) {
    return (
      <div className="flex aictr jcctr h-[50%]">
        <LoadingIcon />
      </div>
    );
  }

  function requestApt() {
    requestPan[1](true);
  }

  if (error?.code) {
    return (
      <div className="w-full h-80 flex aictr jcctr coll gap-8">
        <div className="text-4xl font-bold">Ooops</div>
        <div>We encountered an error while trying to load your data</div>

        <button onClick={reload} className="btn btn-outline btn-primary">
          <Icon name="refresh" />
          Reload page
        </button>

        <code className="m-8">
          Error code: [{error.code}] {error.message}
        </code>
      </div>
    );
  }

  const todayApt = apts.filter(
    (q) => isToday(q.meeting_date) && q.status === "scheduled"
  )[0];

  const pendApt = apts.filter((q) => q.status === "pending")[0];

  // const tday_id = todayApt?.appointment_id || "";
  // const pend_id = pendApt?.appointment_id || "";

  // console.log(tday_id, pend_id);

  const pastApt = apts.filter((q: any) =>
    ["completed", "cancelled"].includes(q.status)
  );

  const nextApt = apts.filter((q: any) => q.status === "scheduled");

  return (
    <div>
      <div className="fixed top-12 right-12">
        <button onClick={reload} className="btn btn-outline btn-primary">
          <Icon name="refresh" />
          Refresh
        </button>
      </div>
      <div className="py-4">
        <div className="cards-grid">
          <div>
            <div className="text-lg font-bold mb-4">Today's Appointment</div>
            {todayApt ? (
              <AppointmentCard data={todayApt} />
            ) : (
              <div {...EmptyBox}>No appointment for today</div>
            )}
          </div>
          <div>
            <div className="text-lg font-bold mb-4">Pending request</div>
            {pendApt ? (
              <AppointmentCard data={pendApt} />
            ) : (
              <div {...EmptyBox}>
                You have no pending request
                <button
                  className="btn btn-outline btn-primary"
                  onClick={requestApt}
                >
                  Request an appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AppointmentList list={nextApt} title="Upcoming appointments" />
      <AppointmentList list={pastApt} title="Previous appointments" />
      <div className="h-8"></div>
      <RequestAppointmentDialog state={requestPan} onFinish={reload} />
    </div>
  );
}

function AppointmentList({ list, title }: { list: any[]; title: string }) {
  if (!list.length) {
    return (
      <div className="py-4">
        <div className="text-lg font-bold mb-4">{title} (0)</div>
        <div {...EmptyBox}>
          <div className="italic">No event to display</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="text-lg font-bold mb-4">
        {title} ({list.length})
      </div>
      <div
        className="cards-grid"
        style={{
          gridTemplateRows: "1fr",
        }}
      >
        {list
          .sort((a, b) => compareAsc(a.meeting_date, b.meeting_date))
          .map((apt: any) => (
            <AppointmentCard data={apt} />
          ))}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

function AppointmentCard({ data }: { data: any }) {
  return (
    <ActionCard
      subIcon="event"
      title={DateUtils.format(data.meeting_date, "EEE, MMMM do yyyy '-' HH:mm")}
      tag={<StatusBadge status={data.status} />}
      subtitle="Appointment"
      description={
        <div className="py-2">
          <div className="flex aictr">
            <div className="w-[30%]">
              {data.status !== "pending" || "Requested "}Doctor:
            </div>
            <div>{data.staff.full_name}</div>
          </div>
          <div className="flex aictr">
            <div className="w-[30%]">Duration:</div>
            <div>{data.duration} minutes</div>
          </div>
        </div>
      }
      details={data.content || "Unnamed appointment"}
      className="inline-block no-animated clickable hover:shadow-lg transition-all active:shadow-none"
      style={{
        borderBottom: `8px solid ${getStatusColor(data.status)}`,
      }}
    />
  );
}
