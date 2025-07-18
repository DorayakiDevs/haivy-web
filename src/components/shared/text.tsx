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

  const extra = [translateColor(color), className];

  const clss = merge("pr-2", ...extra);
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
    <fieldset className="fieldset p-0">
      {!label || (
        <legend className="fieldset-legend text-sm font-semibold">
          {label}
        </legend>
      )}
      <label className={merge("input", width || "w-full")}>
        {!icon || <Icon name={icon} />}
        <input
          className={clss}
          {...rest}
          onInput={handleInput}
          onChange={handleChange}
          value={value}
          autoComplete="off"
        />
      </label>
      {!desc || <p className="label">{desc}</p>}
    </fieldset>
  );
}

export function InputTextErrorable(props: { error?: string } & T_InputProps) {
  const { error, className, color, ...rest } = props;
  const desc = error ? (
    <span className="text-error font-semibold">* {error}</span>
  ) : (
    ""
  );

  return <InputText desc={desc} {...rest} color={error ? "error" : color} />;
}

type T_TextareaProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  width?: string;
  height?: string;
  disabled?: boolean;
  readOnly?: boolean;

  state?: [string, React.Dispatch<React.SetStateAction<string>>];
  className?: string;
};

export function TextArea({
  id,
  label,
  minLength,
  maxLength = 128,
  placeholder,
  width = "w-full",
  height = "h-32",
  disabled = false,
  state,
  readOnly,
  className,
}: T_TextareaProps) {
  const local = useState("");

  const [value, setValue] = state || local;

  function handleChange(e: any) {
    setValue(e.target.value);
  }

  const base = "textarea textarea-bordered resize-none w-full";
  const clss = merge(base, height, className);

  return (
    <div className={`form-control ${width}`}>
      <div className="my-2 flex aiend spbtw">
        <label className="text-sm font-semibold">
          <span className="label-text">{label}</span>
        </label>
        <span>
          {maxLength && (
            <div className="text-xs text-right text-gray-400 mt-1">
              {value.length}/{maxLength}
            </div>
          )}
        </span>
      </div>
      <textarea
        readOnly={readOnly}
        id={id}
        className={clss}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
      />
    </div>
  );
}

export function TextAreaErrorable(props: T_TextareaProps & { error?: string }) {
  const { error, className, ...rest } = props;

  return (
    <div>
      <TextArea
        {...rest}
        className={merge(className, error ? "input-error!" : "")}
      />
      {!error || (
        <div className="text-xs font-semibold text-error mt-1">* {error}</div>
      )}
    </div>
  );
}
