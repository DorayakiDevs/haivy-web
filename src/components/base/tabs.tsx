import { useState } from "react";
import { Tooltips } from "./others";
import { Icon } from "@components/icons";

type T_ListType = {
  name?: string;
  icon?: string | React.ReactNode;
  value: string;
  type?: "icon" | "text";
};

export function TabButton({
  active,
  icon,
  name,
  onClick,
  type = "icon",
}: T_ListType & { active?: boolean; onClick: React.MouseEventHandler }) {
  if (type === "text") {
    return (
      <button className="btn btn-sm flex aictr">
        {icon}
        {name}
      </button>
    );
  }

  return (
    <Tooltips text={name || ""}>
      <button
        onClick={onClick}
        className={
          "btn-primary btn btn-square btn-md " + (active ? "" : "btn-outline")
        }
      >
        {!icon ||
          (typeof icon === "string" ? <Icon name={icon} size="1.5em" /> : icon)}
      </button>
    </Tooltips>
  );
}

export function TabSelector({
  list = [],
  state,
  type,
}: {
  list?: T_ListType[];
  initial?: string;
  state?: React.State<string>;
  type?: "icon" | "text";
}) {
  const local = useState("");

  const [currentTab, setCurrentTab] = state || local;

  return (
    <div className="flex aictr gap-2 h-full">
      {list.map((t, i) => {
        return (
          <TabButton
            {...t}
            key={i}
            type={type}
            active={currentTab === t.value}
            onClick={() => {
              setCurrentTab(t.value);
            }}
          />
        );
      })}
    </div>
  );
}
