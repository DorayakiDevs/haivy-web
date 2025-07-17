import { Icon } from "@components/icons/google";
import Badge from "@components/shared/badge";

import { merge } from "@utils/string";

const BADGE_CLSS = "badge-secondary py-4 rounded-md";
const REGI_CLSS =
  "border-1 border-[#0003] p-4 rounded-box mb-4 hover:bg-secondary transition-all cursor-pointer shadow-md block w-full disabled:opacity-30";

export function RegimenCard({
  data,
  active,
  medsCount,
  ...props
}: {
  data: Haivy.Regimen;
  medsCount?: number | null;
  active?: boolean;
} & React.JSXProps<"button">) {
  return (
    <button
      className={merge(REGI_CLSS, active ? "bg-secondary border-primary!" : "")}
      tabIndex={0}
      disabled={!data.is_available}
      {...props}
    >
      <div className="flex aictr spbtw">
        <div className="text-2xl">{data.name}</div>
        {data.is_available ? <BadgeAvail /> : <BadgeNotAvail />}
      </div>

      <p className="text-sm my-4 text-justify">{data.description}</p>

      <Badge className={BADGE_CLSS}>
        <Icon name="pill" /> {medsCount ?? "N/A"}
      </Badge>

      <Badge className={BADGE_CLSS}>
        <Icon name="bar_chart" /> Level {data.level}
      </Badge>

      <Badge className={BADGE_CLSS}>
        <Icon name="face" /> {data.age_range[0]} - {data.age_range[1]} yr old
      </Badge>
    </button>
  );
}

const BadgeAvail = () => (
  <Badge className={BADGE_CLSS + " badge-success py-2!"}>Available</Badge>
);

const BadgeNotAvail = () => (
  <Badge className={BADGE_CLSS + " badge-warning py-2!"}>Not available</Badge>
);
