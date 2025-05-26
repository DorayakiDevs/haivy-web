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
  state?: [string, React.Dispatch<React.SetStateAction<string>>];
  closeOnClick?: boolean;
};

export function SelectOptions(props: SelectProps) {
  const { options = [], state, closeOnClick } = props;

  const local = useState("");

  const [curValue, setCurValue] = state ?? local;

  let curIndex = -1;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === curValue) {
      curIndex = i;
    }
  }

  return (
    <div className="dropdown dropdown-end dropdown-top">
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
              >
                <div className="flex flex-1 aiart coll">
                  <div>{text || value}</div>
                  {!sub || (
                    <div>
                      <sub>{sub}</sub>
                    </div>
                  )}
                </div>
                {!isSelected || (
                  <div>
                    <Icon name="check" />
                  </div>
                )}
              </div>
              <div className="w-[90%] h-[1px] bg-base-content opacity-[0.1] mx-auto my-1"></div>
            </>
          );
        })}
      </div>
    </div>
  );
}
