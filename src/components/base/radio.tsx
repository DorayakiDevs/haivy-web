import { useState } from "react";

import { Icon } from "../icons";

type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

type Option = {
  text?: string;
  value: string;
};

type Props = {
  options: Option[];
  state?: ReactState<string>;
  size?: number;
  onInput?: (value: string) => void;
} & React.JSXProps<"div">;

export function InputRadio(props: Props) {
  const localState = useState<string>("");
  const { options, onInput, state, size = 20 } = props;

  const [value, setValue] = state ?? localState;

  function isSelected(inp: string) {
    return value === inp;
  }

  function updateValue(newValue: string) {
    return () => {
      if (onInput) onInput(newValue);
      setValue(newValue);
    };
  }

  return (
    <div className="py-1">
      {options.map(({ value, text }, index) => {
        return (
          <div
            className="py-2 flex aictr cursor-pointer"
            onClick={updateValue(value)}
            key={index}
          >
            <div
              className="relative mx-1"
              style={{ width: size, height: size }}
            >
              <Icon
                name="radio_button_checked"
                size={size}
                style={{
                  opacity: isSelected(value) ? 1 : 0,
                  transition: "0.1s all",
                }}
              />
              <Icon
                name="radio_button_unchecked"
                size={size}
                className="absolute top-0 left-0"
              />
            </div>
            <div style={{ fontSize: size * 0.65 }}>{text ?? value}</div>
          </div>
        );
      })}
    </div>
  );
}
