import { Icon } from "@components/icons/google";
import Badge from "@components/shared/badge";
import useNav from "@hooks/useNav";
import { format } from "date-fns";

export function AppointmentCard({ data }: { data: Haivy.Appointment }) {
  const nav = useNav();

  const {
    status,
    duration,
    staff_id,
    content,
    meeting_date,
    is_online,
    appointment_id,
  } = data;

  function viewSchedule() {
    nav("/schedule?view=schedule&date=" + format(meeting_date, "yyyy-MM-dd"));
  }

  function viewDetails() {
    nav("/appointments/" + appointment_id);
  }

  return (
    <div className="card card-md bg-base-100 min-w-64 min-h-44 border-1">
      <div className="card-body p-4">
        <div className="sub-head flex aictr spbtw">
          <div className="flex aictr gap-2">
            <Icon name="event" />
            {duration} minutes
          </div>
          <div>
            <Badge className="badge-sm badge-primary capitalize">
              {status}
            </Badge>
            <Badge className="badge-sm badge-primary">
              {is_online ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
        <div className="my-2">
          <div>Scheduled on</div>
          <h1 className="text-lg">
            {meeting_date
              ? format(meeting_date, "EEEE, dd.MM.yyyy - kk:mm")
              : "Unkwnown date"}
          </h1>
        </div>
        <div>
          <div className="text-base-content/60">Note</div>
          <p>{content}</p>
        </div>
      </div>
      <div className="card-actions p-2">
        <button
          className="btn btn-sm btn-primary btn-soft w-full"
          onClick={viewSchedule}
        >
          View in schedule
        </button>
        <button
          className="btn btn-sm btn-primary btn-soft w-full"
          onClick={viewDetails}
        >
          Appointment's details
        </button>
      </div>
    </div>
  );
}
