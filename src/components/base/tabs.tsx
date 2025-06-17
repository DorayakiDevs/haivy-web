import { useEffect, useState } from "react";
import { Tooltips } from "./others";
import { Icon } from "@components/icons";

type T_ListType = {
  name?: string;
  icon?: string;
  value: string;
};

export function TabButton({
  active,
  icon,
  name,
  onClick,
}: T_ListType & { active?: boolean; onClick: React.MouseEventHandler }) {
  return (
    <Tooltips text={name || ""}>
      <button
        onClick={onClick}
        className={
          "btn-primary btn btn-square btn-md " + (active ? "" : "btn-outline")
        }
      >
        {!icon || <Icon name={icon} size="1.5em" />}
      </button>
    </Tooltips>
  );
}

export function TabSelector({
  list = [],
  state,
}: {
  list?: T_ListType[];
  initial?: string;
  state?: React.State<string>;
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
