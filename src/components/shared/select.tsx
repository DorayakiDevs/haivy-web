import { useState } from "react";

import { Icon } from "@components/icons/google";

type Options<T> = {
  value: T;
  text?: React.ReactNode;
  sub?: string;
  closeOnClick?: boolean;
};

type SelectProps<T> = {
  options?: Options<T>[];
  state?: [T, (s: T) => void];
  closeOnClick?: boolean;
  direction?: string;
  label?: string;
  width?: string;
  readOnly?: boolean;
};

export function SelectOptions<T extends string>(props: SelectProps<T>) {
  const {
    options = [],
    state,
    closeOnClick,
    direction = "top left",
    label,
    width,
    readOnly = false,
  } = props;

  const local = useState("");

  const [curValue, setCurValue] = state ?? local;

  let curIndex = -1;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === curValue) {
      curIndex = i;
    }
  }

  const clssArr = ["dropdown"];

  if (direction.includes("top")) {
    clssArr.push("dropdown-top");
  } else if (direction.includes("bottom")) {
    clssArr.push("dropdown-bottom");
  }

  if (direction.includes("left")) {
    clssArr.push("dropdown-start");
  } else if (direction.includes("right")) {
    clssArr.push("dropdown-end");
  }

  if (width) {
    clssArr.push(width);
  }

  if (readOnly) {
    clssArr.push("pointer-events-none");
  }

  return (
    <div className={clssArr.join(" ")}>
      {!label || <div className="font-semibold text-sm">{label}</div>}
      <div tabIndex={0} role="button" className={"btn bg-base-200 w-full"}>
        <div className="flex-1 text-left">
          {options[curIndex]?.text ??
            options[curIndex]?.value ??
            "Select an option"}
        </div>
        <Icon name="arrow_drop_down" />
      </div>

      <div
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-2 p-2 shadow-lg mt-2"
      >
        {options.map(({ value, text, sub, closeOnClick: oClose }, index) => {
          const clssArr = ["btn btn-ghost p-2 gap-0 w-70 rounded-sm"];
          const isSelected = index === curIndex;

          if (isSelected) {
            clssArr.push("active");
          }

          return (
            <div
              className={clssArr.join(" ")}
              style={{ height: "fit-content" }}
              onClick={() => {
                setCurValue(value);

                if (oClose ?? closeOnClick)
                  if (document.activeElement instanceof HTMLElement)
                    document.activeElement.blur();
              }}
              key={"opt-" + index}
            >
              <div className="flex flex-1 aiart coll">
                <div>{text || value}</div>
                {!sub || <div className="text-xs text-gray-600">{sub}</div>}
              </div>
              {!isSelected || (
                <div>
                  <Icon name="check" size="1.25em" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
