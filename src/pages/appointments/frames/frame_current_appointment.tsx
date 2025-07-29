import { Icon } from "@components/icons/google";

import { Frame, InfoRow } from "@pages/appointments/component";

import { useAptDetails } from "../hooks/useAppointmentDetails";
import { Link } from "react-router";
import { Loading } from "@components/icons/loading";

export function CurrentAppointmentFrame() {
  const { details } = useAptDetails();

  if (!details) {
    return <Loading />;
  }

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
        {details.is_online ? (
          <InfoRow
            name={"Online appointment"}
            desc={
              <a
                href={details.meeting_link}
                className="link link-hover"
                target="_blank"
              >
                Meeting Link
              </a>
            }
            icon={<Icon name="link" size="2em" />}
            className="gap-2"
          />
        ) : (
          <InfoRow
            desc="Offline appointment"
            icon={<Icon name="meeting_room" size="2em" />}
            className="gap-2"
          />
        )}
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
