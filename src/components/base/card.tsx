import { Icon } from "@components/icons";

import type { DatabaseColType } from "@services/global";
import Badge from "./badge";

import { formatDate } from "@utils/converter";

type Props = {} & React.JSX.IntrinsicElements["div"];

export function Card(props: Props) {
  const { className, ...rest } = props;

  const clssArr = ["card bg-base-100"];

  if (className) {
    clssArr.push(className);
  }

  return <div className={clssArr.join(" ")} {...rest} />;
}

type ActtionCardProps = {
  subtitle?: string;
  subIcon?: string;

  tag?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;

  title?: string;
  actions?: {
    title: string;
    onClick?: React.MouseEventHandler;
  }[];
} & React.JSX.IntrinsicElements["div"];

export function ActionCard(props: ActtionCardProps) {
  const {
    subtitle,
    subIcon,
    tag,
    description,
    content,
    title,
    actions = [],
    className,
    style,
    ...rest
  } = props;

  return (
    <div
      className={[
        "card-expand card bg-base-200 w-80 rounded-lg p-4 gap-3",
        className,
      ].join(" ")}
      style={{ border: "2px solid #0001", ...style }}
      {...rest}
    >
      <div className="subhead flex aictr spbtw gap-1 text-xs">
        <div className="flex aictr gap-2 font-bold">
          <Icon name={subIcon || ""} size="1.5em" />
          {subtitle}
        </div>
        <div>{tag}</div>
      </div>
      <div className="text-clip overflow-hidden">
        <div className="card-title text-md">{title}</div>
        <div className="text-sm font-semibold">{description}</div>
      </div>
      <div className="content text-sm my-3 overflow-hidden flex-1">
        {content}
      </div>
      {!title || (
        <div className="actions flex aictr gap-2">
          {actions.map((action, i) => {
            return (
              <button
                className="btn-sm btn btn-primary flex-1"
                onClick={action.onClick}
                key={i}
              >
                {action.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type Appointment = DatabaseColType<"appointment">;

type AppointmentCardProps = {
  data: Appointment;
} & ActtionCardProps;

export function AppointmentCard({ data, ...rest }: AppointmentCardProps) {
  return (
    <ActionCard
      subIcon="event"
      title={formatDate(data.meeting_date)}
      tag={
        <Badge className="badge-primary badge-sm capitalize">
          {data.status}
        </Badge>
      }
      subtitle={formatDate(data.created_date)}
      description={!data.staff_id || "by " + data.staff_id}
      content={data.content || "No more info provided"}
      {...rest}
    />
  );
}

export function MedicineCard() {
  return (
    <div className="bg-base-300 rounded-md flex aictr gap-4">
      <img
        className="h-22 aspect-1 rounded-md"
        src="https://khoevadeppharmacy.com/wp-content/uploads/2021/08/PANADOL.jpg"
      />
      <div className="flex-1 pr-4">
        <div className="font-semibold flex aictr spbtw flex-1">
          <div>Paracetamol Extra</div>
          <Badge className="badge-primary rounded-sm">3 left</Badge>
        </div>
        <div className="text-xs flex coll spbtw">
          <div>
            <div className="aictr flex gap-1">
              <Icon name="schedule" size="1.1em" />
              Morning & Afternoon
            </div>
          </div>
          <div className="aictr flex gap-1">
            <Icon name="note" size="1.1em" />
            Note: Taken before meal
          </div>
        </div>
      </div>
    </div>
  );
}
