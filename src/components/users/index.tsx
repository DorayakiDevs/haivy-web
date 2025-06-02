import { Icon } from "@components/icons";
import { useUserInfo } from "@services/data/info";
import type { DatabaseColType } from "@services/global";

type UserInfo = DatabaseColType<"accountdetails">;

export function UUIDTag({ uuid }: { uuid?: string }) {
  return <div>{uuid}</div>;
}

export function UserAutoInfo({ id }: { id: string }) {
  const data = useUserInfo(id);

  if (data.status === "loading" || data.status === "idle") {
    return <div className="h-3 w-24 skeleton bg-[#0004]"></div>;
  }

  if (data.status === "error" || data.data === null) {
    return <div className="badge badge-xs badge-error">Cannot get data</div>;
  }

  return <UserInfoInline data={data.data} />;
}

export function UserInfoInline(props: {
  data: UserInfo;
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
      <div className="flex aictr gap-2">
        <div className="link link-hover font-semibold">
          {data.first_name} {data.last_name}
        </div>
      </div>
    </div>
  );
}
