import Badge from "@components/base/badge";
import { InputTextErrorable } from "@components/base/input";
import { Icon } from "@components/icons";
import { LoadingIcon } from "@components/icons/others";

import { getUserInfo } from "@services/rpc/info";
import { useUserList } from "@services/rpc/user";
import { useState } from "react";

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

type T_UserSearchProps = {
  label?: string;
  state: [
    Haivy.User | null,
    React.Dispatch<React.SetStateAction<Haivy.User | null>>
  ];
  roleFilter?: string[];
  error?: string;
  readOnly?: boolean;
};

export function UserSearchInput(props: T_UserSearchProps) {
  const {
    label = "Search user",
    roleFilter = [],
    error,
    readOnly = false,
  } = props;

  const local = useState<Haivy.User | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [curIndex, setCurIndex] = useState(0);

  const result = useUserList(userQuery);

  const [user, setUser] = props.state || local;

  function roleFilterFunc(u: Haivy.User) {
    return u.roles.map((c) => roleFilter.includes(c)).includes(true);
  }

  const list = (result.status === "success" ? result.data : []).filter(
    roleFilterFunc
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    const { key } = e;

    if (result.status !== "success") return;

    switch (key) {
      case "ArrowDown": {
        setCurIndex((i) => (i + 1 >= list.length ? 0 : i + 1));
        break;
      }

      case "ArrowUp": {
        setCurIndex((i) => (i - 1 < 0 ? list.length - 1 : i - 1));
        break;
      }

      case "Enter": {
        setUser(list[curIndex]);
        return;
      }
    }
  }

  const inpClass = "w-full";

  return (
    <div className="dropdown dropdown-end w-full block">
      {user ? (
        <InputTextErrorable
          className={inpClass}
          label={label}
          state={[user.full_name, () => setUser(null)]}
          icon="person"
          readOnly={readOnly}
        />
      ) : (
        <>
          <InputTextErrorable
            className={inpClass}
            label={label}
            state={[userQuery, setUserQuery]}
            placeholder="Type to search"
            icon="person"
            onKeyDown={handleKeyDown}
            error={error}
            readOnly={readOnly}
          />
          <div className="menu dropdown-content w-full bg-base-100 shadow-xl rounded-lg">
            {(() => {
              if (user) {
                return "";
              }

              if (result.status === "loading") {
                return (
                  <div className="w-full flex jcctr py-4">
                    <LoadingIcon size={"size-6"} />
                  </div>
                );
              }

              if (!list.length) {
                return (
                  <i className="tactr my-4">Cannot find any suitable user</i>
                );
              }

              return list.map((u, i) => {
                return (
                  <li
                    key={u.user_id + "i"}
                    onMouseDown={() => setUser(u)}
                    className={i === curIndex ? "bg-base-300 rounded-md" : ""}
                  >
                    <UserInfo data={u} />
                  </li>
                );
              });
            })()}
          </div>
        </>
      )}
    </div>
  );
}
