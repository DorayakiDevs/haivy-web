import { Icon } from "@components/icons/google";
import Badge from "@components/shared/badge";
import { snakeCap } from "@utils/converter";

import { StatusColor } from "@utils/data";
import { format } from "date-fns";

type T_Ticket = Haivy.Table<"ticket">["Row"];

function getStatusColor(status: string | null): string {
  return StatusColor[status || ""] || "var(--color-primary)";
}

function getTypeColor(_type: string | null) {
  return "var(--color-primary)";
}

export function TicketCard({
  ticket,
  className = "h-48",
  ...props
}: {
  ticket: T_Ticket;
  className?: string;
} & React.JSXProps<"div">) {
  const statusColor = getStatusColor(ticket.status);

  return (
    <div
      className={`card card-md bg-base-100 min-w-64 max-w-128 ${className} clickable shadow-sm hover:shadow-md`}
      style={{
        border: `1px solid ${statusColor}`,
      }}
      {...props}
    >
      <div className="card-body p-4">
        <div className="sub-head flex aictr spbtw">
          <div className="flex aictr gap-2">
            <Icon name="confirmation_number" />
            {!ticket.date_created ||
              format(ticket.date_created, "EEE, dd.MM.yyyy")}
          </div>
          <Badge
            className="badge-sm capitalize text-white"
            style={{
              backgroundColor: statusColor,
            }}
          >
            {ticket.status}
          </Badge>
        </div>
        <div className="">
          <h1 className="text-[1.05rem] line-clamp-2 my-2">{ticket.title}</h1>
          <p className="line-clamp-2">
            {ticket.content || <i>No description provided</i>}
          </p>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge(props: { status: string | null; size?: string }) {
  return (
    <Badge
      style={{
        background: getStatusColor(props.status),
        textTransform: "capitalize",
        color: "#fff",
      }}
      className={"p-3 " + props.size}
    >
      {snakeCap(props.status || "")}
    </Badge>
  );
}

export function TypeBadge(props: { type: string | null }) {
  return (
    <Badge
      style={{
        background: getTypeColor(props.type),
        textTransform: "capitalize",
        color: "#fff",
      }}
      className="p-3"
    >
      {props.type}
    </Badge>
  );
}
