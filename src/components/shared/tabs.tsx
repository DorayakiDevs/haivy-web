import { useState } from "react";
import { Tooltip } from "./tooltip";
import { Icon } from "../icons/google";

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
      <button
        onClick={onClick}
        className={
          "btn btn-primary btn-sm flex aictr " + (active ? "" : "btn-outline")
        }
      >
        {icon}
        {name}
      </button>
    );
  }

  return (
    <Tooltip title={name || ""} className="tooltip-top">
      <button
        onClick={onClick}
        className={
          "btn-primary btn btn-square btn-md " + (active ? "" : "btn-outline")
        }
      >
        {!icon ||
          (typeof icon === "string" ? <Icon name={icon} size="1.5em" /> : icon)}
      </button>
    </Tooltip>
  );
}

export function TabSelector({
  tabs = [],
  state,
  type,
}: {
  tabs?: T_ListType[];
  initial?: string;
  state?: React.State<string>;
  type?: "icon" | "text";
}) {
  const local = useState("");

  const [currentTab, setCurrentTab] = state || local;

  return (
    <div className="flex aictr gap-2 h-full">
      {tabs.map((t, i) => {
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
