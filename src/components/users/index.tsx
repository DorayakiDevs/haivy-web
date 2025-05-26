import { Icon } from "@components/icons";
import type { DatabaseColType } from "@services/global";

type UserInfo = DatabaseColType<"accountdetails">;

export function UUIDTag({ uuid }: { uuid?: string }) {
  return <div>{uuid}</div>;
}

export function UserInfoInline(props: {
  data: UserInfo | null;
  hideAvatar?: boolean;
}) {
  const { data, hideAvatar: _ } = props;

  if (!data) {
    return (
      <div className="flex aictr gap-1">
        <Icon name="terminal" size="1.5em" />
        <div className="font-bold"> System</div>
      </div>
    );
  }

  return (
    <div className="inline-flex aictr gap-2">
      {_ || (
        <img
          src={data.profile_picture || ""}
          height={28}
          width={28}
          className="rounded-full"
        />
      )}
      <div className="flex aictr gap-2">
        <div className="link link-hover font-semibold">
          {data.first_name} {data.last_name}
        </div>
        <div className="badge-xs capitalize badge">{data.account_type}</div>
      </div>
    </div>
  );
}
