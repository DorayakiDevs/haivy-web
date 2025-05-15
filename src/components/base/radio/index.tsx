import { Icon } from "../icons";
import "./index.css";

import React, { useState } from "react";

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
} & React.JSX.IntrinsicElements["div"];

export default function InputRadio(props: Props) {
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
    <div className="dft-input-radio">
      <div className="radio-options">
        {options.map(({ value, text }, index) => {
          return (
            <div
              className="option flex aictr"
              onClick={updateValue(value)}
              key={index}
            >
              <div className="icon" style={{ width: size, height: size }}>
                <Icon
                  name="radio_button_checked"
                  size={size}
                  style={{
                    opacity: isSelected(value) ? 1 : 0,
                    transition: "0.1s all",
                  }}
                />
                <Icon name="radio_button_unchecked" size={size} />
              </div>
              <div style={{ fontSize: size * 0.65 }}>{text ?? value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
