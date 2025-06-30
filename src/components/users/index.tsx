import { useState } from "react";

import Badge from "@components/base/badge";
import { InputTextErrorable } from "@components/base/input";
import { LoadingIcon } from "@components/icons/others";

import { getUserInfo } from "@services/rpc/info";
import { useUserList } from "@services/rpc/user";

import { Parser } from "@utils/parser";

export function UUIDTag({ uuid }: { uuid?: string }) {
  return <div>{uuid}</div>;
}

type T_UserInfoProps = {
  data: Haivy.User | null;
  inline?: boolean;
  hideAvatar?: boolean;
  hideRole?: boolean;
  roleCount?: number;
  miniRole?: boolean;
};

export function UserAutoInfo({
  id,
  ...props
}: { id: string | null } & Omit<T_UserInfoProps, "data">) {
  if (id === null) {
    return <UserInfo {...props} data={null} />;
  }

  return <UserFromID id={id} {...props} />;
}

export function UserFromID({
  id,
  ...props
}: { id: string } & Omit<T_UserInfoProps, "data">) {
  const data = getUserInfo(id);

  if (data.status === "loading" || data.status === "idle") {
    return <div className="inline-block h-3 w-24 skeleton bg-[#0004]"></div>;
  }

  if (data.status === "error" || data.data === null) {
    return <div className="badge badge-xs badge-error">Cannot get data</div>;
  }

  return <UserInfo {...props} data={data.data} />;
}

export function UserInfoInline(props: { data: Haivy.User | null }) {
  const { data: _data } = props;

  const data = _data || {
    full_name: "System",
    profile_image_url: location.origin + "/logo.svg",
    roles: ["administrator"],
    birth_date: null,
    user_id: "",
  };

  return (
    <div className="inline-flex aictr gap-2 align-middle">
      <div className="flex aictr gap-2 w-full">
        <div className="link link-hover font-semibold flex-1">
          {data.full_name}
        </div>
      </div>
    </div>
  );
}

export function UserInfo(props: T_UserInfoProps) {
  const { data: _data, roleCount = 1, hideRole, hideAvatar } = props;

  if (props.inline) {
    return <UserInfoInline data={_data} />;
  }

  const data = _data || {
    full_name: "System",
    profile_image_url: location.origin + "/logo.svg",
    roles: ["administrator"],
    birth_date: null,
    user_id: "",
  };

  return (
    <div className="flex aictr gap-2">
      {hideAvatar || (
        <div
          style={{
            backgroundImage: Parser.getUserAvatar(data),
          }}
          className="w-6 h-6 rounded-full bg-cover bg-center"
        ></div>
      )}
      <div className="flex aictr gap-4 flex-1">
        <div className="link link-hover font-semibold flex-1">
          {data.full_name}
        </div>
        {hideRole ||
          data.roles.slice(0, roleCount).map((d, i) =>
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
  state?: [
    Haivy.User | null,
    React.Dispatch<React.SetStateAction<Haivy.User | null>>
  ];
  roleFilter?: string[];
  error?: string;
  readOnly?: boolean;
  direction?: string;
};

export function UserSearchInput(props: T_UserSearchProps) {
  const {
    label = "",
    roleFilter = [],
    error,
    readOnly = false,
    direction = "left bottom",
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
  const dirs = [];

  if (direction.includes("top")) {
    dirs.push("dropdown-top");
  } else if (direction.includes("bottom")) {
    dirs.push("dropdown-bottom");
  }

  if (direction.includes("left")) {
    dirs.push("dropdown-start");
  } else if (direction.includes("right")) {
    dirs.push("dropdown-end");
  }

  return (
    <div className={"dropdown w-full block " + dirs.join(" ")}>
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
          <div
            className={
              "menu dropdown-content w-full bg-base-100 shadow-xl rounded-lg"
            }
          >
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
