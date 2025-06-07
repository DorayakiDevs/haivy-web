import Badge from "@components/base/badge";
import { Icon } from "@components/icons";

import { getUserInfo } from "@services/rpc/info";

export function UUIDTag({ uuid }: { uuid?: string }) {
  return <div>{uuid}</div>;
}

type T_UserInfoProps = {
  data: Haivy.User | null;
  inline?: boolean;
  hideAvatar?: boolean;
  roleCount?: number;
  miniRole?: boolean;
};

export function UserAutoInfo({
  id,
  ...props
}: { id: string | null } & Omit<T_UserInfoProps, "data">) {
  const data = getUserInfo(id);

  if (data.status === "loading" || data.status === "idle") {
    return <div className="h-3 w-24 skeleton bg-[#0004]"></div>;
  }

  if (data.status === "error" || data.data === null) {
    return <div className="badge badge-xs badge-error">Cannot get data</div>;
  }

  return <UserInfo {...props} data={data.data} />;
}

export function UserInfoInline(props: { data: Haivy.User | null }) {
  const { data } = props;

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
      <div className="flex aictr gap-2 w-full">
        <div className="link link-hover font-semibold flex-1">
          {data.full_name}
        </div>
      </div>
    </div>
  );
}

export function UserInfo(props: T_UserInfoProps) {
  const { data, roleCount = 1 } = props;
  if (!data) return;

  return (
    <div className="inline-flex aictr gap-2">
      {props.hideAvatar || (
        <img
          src={data.profile_image_url || `${window.location.origin}/avatar.jpg`}
          className="w-6 h-6 rounded-full"
        />
      )}
      <div className="flex aictr gap-4 w-full">
        <div className="link link-hover font-semibold flex-1">
          {data.full_name}
        </div>
        {data.roles.slice(0, roleCount).map((d, i) =>
          props.miniRole ? (
            <span className="text-sm">{d}</span>
          ) : (
            <Badge className="capitalize badge-sm" key={i}>
              {d}
            </Badge>
          )
        )}
      </div>
    </div>
  );
}
