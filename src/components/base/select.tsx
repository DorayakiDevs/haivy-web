import { useState } from "react";

import { Icon } from "@components/icons";

type Options = {
  value: string;
  text?: React.ReactNode;
  sub?: string;
  closeOnClick?: boolean;
};

type SelectProps = {
  options?: Options[];
  state?: [string, (s: string) => void];
  closeOnClick?: boolean;
  direction?: string;
};

export function SelectOptions(props: SelectProps) {
  const { options = [], state, closeOnClick, direction = "top end" } = props;

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

  if (direction.includes("start")) {
    clssArr.push("dropdown-start");
  } else if (direction.includes("end")) {
    clssArr.push("dropdown-end");
  }

  if (clssArr)
    return (
      <div className={clssArr.join(" ")}>
        <div tabIndex={0} role="button" className="btn bg-base-300 m-1">
          <div className="px-2">
            {options[curIndex]?.text ||
              options[curIndex]?.value ||
              "Select an option"}
          </div>
          <Icon name="arrow_drop_down" />
        </div>

        <div
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-lg"
        >
          {options.map(({ value, text, sub, closeOnClick: oClose }, index) => {
            const clssArr = ["btn btn-ghost p-2 gap-0 w-70 rounded-sm"];
            const isSelected = index === curIndex;

            if (isSelected) {
              clssArr.push("active");
            }

            return (
              <>
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
                    {!sub || <div style={{ fontSize: 8 }}>{sub}</div>}
                  </div>
                  {!isSelected || (
                    <div>
                      <Icon name="check" size="1em" />
                    </div>
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
    );
}
