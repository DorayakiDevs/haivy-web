import { addDays } from "date-fns";

import { LoadingIcon } from "@components/icons/others";
import { ColumnChart } from "@components/chart";
import { Icon } from "@components/icons";

import { getAppointments } from "@services/rpc/appointments";
import { getTickets } from "@services/rpc/ticket";
import { useClient } from "services/client";

import { AppointmentDisplay } from "@pages/schedules/components";
import { FullscreenLoading } from "@pages/others/loading";
import { adjustTimeToLocal } from "@pages/schedules/utils";

import { DateUtils } from "@utils/date";
import { useNavigate } from "react-router";

export function StaffDashboard() {
  const { session, account } = useClient();

  if (!account || !session) return <FullscreenLoading />;

  const { full_name } = account;
  const displayName = full_name.trim() || "Unnamed idiot";

  const authAccount = session?.user.email || "+" + session?.user.phone;

  return (
    <div className="h-full key-fade-in flex coll">
      <div className="py-6 flex aictr spbtw">
        <div className="">
          <div>Welcome back</div>
          <div className="text-4xl font-bold">
            {displayName.includes("null") ? "Have a great day" : displayName}
          </div>
          <div className="text-sm">Signed in as: {authAccount}</div>
        </div>
      </div>

      <div className="flex-1 flex pb-8 gap-4 overflow-hidden">
        <div className="flex coll gap-4 w-[30%] max-w-128">
          <TicketOverview />
          <NotificationOverview />
        </div>
        <div className="flex-1 h-full pr-8">
          <ScheduleOverview />
        </div>
      </div>
    </div>
  );
}

const CLSS =
  "rounded-xl p-4 pt-0 bg-base-300 hover:shadow-lg transition-all flex-1 key-fade-in";

function TicketOverview() {
  function Header() {
    return (
      <div className="p-2 pt-4 flex aiend gap-4">
        <Icon name="confirmation_number" size="3em" />
        <div>
          <div>Overview</div>
          <div className="text-xl font-bold">Tickets</div>
        </div>
      </div>
    );
  }

  const tickets = getTickets();

  if (tickets.status !== "success") {
    return (
      <div className={CLSS}>
        <Header />
        <div className="flex aictr jcctr h-[80%]">
          <LoadingIcon />
        </div>
      </div>
    );
  }

  const list = tickets.data;
  const index = ["pending", "approved", "cancelled"];
  const counts = [0, 0, 0];

  for (let i = 0; i < list.length; i++) {
    const stat = list[i].status;
    counts[index.indexOf(stat)]++;
  }

  // console.log("I love you :3"); // Thanks

  return (
    <div className={CLSS}>
      <div className="flex aictr spbtw border-b-1 border-[#0002]">
        <Header />

        <button className="btn btn-outline btn-primary">
          View all tickets
        </button>
      </div>
      <div className="h-72 pt-8 flex jcctr aictr">
        <ColumnChart
          columns={[
            {
              name: "Pending",
              value: counts[0],
              color: "var(--color-warning)",
            },
            {
              name: "Success",
              value: counts[1],
              color: "var(--color-success)",
            },
            {
              name: "Dismissed",
              value: counts[2],
              color: "var(--color-error)",
            },
          ]}
        />
      </div>
    </div>
  );
}

function NotificationOverview() {
  return (
    <div className={CLSS}>
      <div className="p-2 pt-4">
        <div className="text-xl font-bold">Notification (0)</div>
      </div>

      <div className="w-full h-30 flex aictr jcctr">
        <i>No notification to show</i>
      </div>
    </div>
  );
}

function ScheduleOverview() {
  const navigate = useNavigate();

  function Header() {
    return (
      <div className="p-2 pt-4 flex aictr gap-4">
        <Icon name="event" size="3em" />
        <div>
          <div>Overview (Showing next 7 events)</div>
          <div className="text-xl font-bold">Upcoming appointments</div>
        </div>
      </div>
    );
  }

  function NavigateToSchedule() {
    navigate("/schedule?view=schedule");
  }

  const today = new Date();
  const next = addDays(today, 365);

  const appointments = getAppointments(today, next);

  if (appointments.status !== "success") {
    return (
      <div className={CLSS + " h-full"}>
        <Header />

        <div className="flex aictr jcctr h-[80%]">
          <LoadingIcon />
        </div>
      </div>
    );
  }

  const list = adjustTimeToLocal(appointments.data).slice(0, 7);

  if (!list.length) {
    return (
      <div className={CLSS + " h-full"}>
        <Header />

        <div className="flex coll aictr jcctr h-[80%]">
          <Icon name="sentiment_excited" size="6rem" />
          <i className="mt-8">No events to display</i>
        </div>
      </div>
    );
  }

  const groups: Record<string, { list: any[]; date: Date }> = {};

  list.forEach((q) => {
    if (!q.meeting_date) return;
    if (q.status !== "scheduled") return;

    const date = new Date(q.meeting_date);
    const dateStr = DateUtils.format(date, "yyyy-MM-dd");

    if (groups[dateStr]) {
      groups[dateStr].list.push(q);
    } else {
      groups[dateStr] = { list: [q], date: date };
    }
  });

  return (
    <div className={CLSS + " h-full overflow-y-auto"}>
      <div className="flex aictr spbtw border-b-1 border-[#0002] sticky top-0 bg-base-300 z-1">
        <Header />

        <button
          className="btn btn-outline btn-primary"
          onClick={NavigateToSchedule}
        >
          View all schedule
        </button>
      </div>

      <div className="key-fade-in">
        {Object.keys(groups).map((key) => {
          const group = groups[key];

          return (
            <div className="mt-4 mb-2">
              <div
                className="px-4 font-bold link link-hover"
                onClick={() => {
                  const day = DateUtils.format(group.date, "yyyy-MM-dd");
                  navigate(`/schedule?date=${day}`);
                }}
              >
                {DateUtils.format(group.date, "EEEE, MMMM do yyyy")}
              </div>
              {group.list
                .sort((a, b) => (a.meeting_date > b.meeting_date ? 1 : -1))
                .map((a) => (
                  <AppointmentDisplay app={a} baseHeight={40} displayAsLine />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
