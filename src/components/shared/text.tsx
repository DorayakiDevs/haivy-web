import { useState } from "react";

import { merge } from "@utils/string";
import { Icon } from "@components/icons/google";

type T_InputProps = {
  label?: React.ReactNode;
  desc?: React.ReactNode;
  color?: Style.Color;
  state?: React.State<string>;
  icon?: string;
  width?: string;
} & React.JSXProps<"input">;

function translateColor(dir: Style.Color | undefined) {
  switch (dir) {
    case "primary":
      return "input-primary";
    case "secondary":
      return "input-secondary";
    case "accent":
      return "input-accent";
    case "info":
      return "input-info";
    case "success":
      return "input-success";
    case "warning":
      return "input-warning";
    case "error":
      return "input-error";

    default:
    case "neutral":
      return "input-neutral";
  }
}

export function InputText(props: T_InputProps) {
  const { width, label, desc, state, icon, ...inputProps } = props;
  const { onChange, onInput, className, color, ...rest } = inputProps;

  const extra = [className, translateColor(color)];

  const clss = merge("pl-2", ...extra);
  const [value, setValue] = state ?? useState<string>("");

  function handleInput(e: any) {
    setValue(e.target.value);
    if (onInput) onInput(e);
  }

  function handleChange(e: any) {
    setValue(e.target.value);
    if (onChange) onChange(e);
  }

  return (
    <fieldset className="fieldset">
      {!label || <legend className="fieldset-legend">{label}</legend>}
      <label className={merge("input", width || "w-full")}>
        {!icon || <Icon name={icon} />}
        <input
          className={clss}
          {...rest}
          onInput={handleInput}
          onChange={handleChange}
          value={value}
        />
      </label>
      {!desc || <p className="label">{desc}</p>}
    </fieldset>
  );
}

export function InputTextErrorable(props: { error: string } & T_InputProps) {
  const { error, ...rest } = props;
  const desc = error ? <span className="text-error">* {error}</span> : "";

  return <InputText desc={desc} {...rest} />;
}
