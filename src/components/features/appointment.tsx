import { Icon } from "@components/icons/google";
import Badge from "@components/shared/badge";
import { format } from "date-fns";

export function AppointmentCard({ data }: { data: Haivy.Appointment }) {
  const { status, duration, staff_id, content, meeting_date } = data;

  return (
    <div className="card card-md bg-base-200 min-w-64 min-h-44 border-1 clickable">
      <div className="card-body p-4">
        <div className="sub-head flex aictr spbtw">
          <div className="flex aictr gap-2">
            <Icon name="event" />
            {duration} minutes
          </div>
          <Badge className="badge-sm badge-primary">{status}</Badge>
        </div>
        <div className="mb-2">
          <h1 className="card-title">
            {meeting_date
              ? format(meeting_date, "EEEE, dd.MM.yyyy - kk:mm")
              : "Unkwnown date"}
          </h1>
          <h2>{staff_id}</h2>
        </div>
        <div>
          <div className="font-semibold">Note</div>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}
