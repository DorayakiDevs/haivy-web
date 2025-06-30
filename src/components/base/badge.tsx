type Props = React.JSXProps<"span">;

export default function Badge(props: Props) {
  const { className, ...rest } = props;

  const clssArr = ["badge mr-1"];

  if (className) {
    clssArr.push(className);
  }

  return <span className={clssArr.join(" ")} {...rest} />;
}

export function getStatusColor(status: string | null): string {
  switch (status) {
    case "pending":
      return "#d97706";
    case "scheduled":
      return "#1d4ed8";
    case "in_progress":
      return "#3730a3";
    case "completed":
      return "#047857";
    case "cancelled":
      return "#9f1239";
    case "no_show":
      return "#374151";
    case "ghost":
      return "#888888";
    default:
      return "var(--color-primary)";
  }
}

export function StatusBadge({ status: s }: { status: string | null }) {
  return (
    <div
      className="badge badge-ghost badge-sm capitalize"
      style={{ background: getStatusColor(s), color: "var(--color-white)" }}
    >
      {s?.replace("_", " ")}
    </div>
  );
}
