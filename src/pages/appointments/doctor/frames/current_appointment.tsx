import { format } from "date-fns";

import { Icon } from "@components/icons/google";

import { Frame, InfoRow } from "@pages/appointments/component";

import { useAptDetails } from "../details";
import { Link } from "react-router";

export function CurrentAppointmentFrame() {
  const { details } = useAptDetails();

  return (
    <Frame className="flex-1 pb-0">
      <div>Current appointment</div>
      <div className="flex-1 flex coll spevl">
        <InfoRow
          name={details.duration + " minutes"}
          desc="Duration"
          icon={<Icon name="clock_loader_40" size="2em" />}
          className="gap-2"
        />
        <InfoRow
          name={format(details.created_date || "", "EEEE, dd.MM.yyyy")}
          desc="Created on"
          icon={<Icon name="event" size="2em" />}
          className="gap-2"
        />
        <InfoRow
          desc={
            <Link to={`/tickets/${details.ticket_id}`} className="link-hover">
              Link to support ticket
            </Link>
          }
          icon={<Icon name="confirmation_number" size="2em" />}
        />
      </div>
    </Frame>
  );
}
