import { Icon } from "../icons";
import "./index.css";

import React from "react";

type Option = {
  text?: string;
  value: string | number;
};

type Props = {
  options: Option[];
  onInput?: ({
    index,
    value,
  }: {
    index: number;
    value: string | number;
  }) => void;
} & React.JSX.IntrinsicElements["div"];

export default function InputRadio(props: Props) {
  const { options, onInput } = props;

  return (
    <div className="dft-input-radio">
      <div className="radio-options">
        {options.map((option) => (
          <div className="option flex aictr">
            <Icon name="radio_button_unchecked" size={20} />
            <label>{option.text ?? option.value}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
