import { useState } from "react";

type TextareaProps = {
  id?: string;
  label?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  width?: string;
  height?: string;
  disabled?: boolean;

  state?: [string, React.Dispatch<React.SetStateAction<string>>];
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
}: TextareaProps) {
  const local = useState("");

  const [value, setValue] = state || local;

  function handleChange(e: any) {
    setValue(e.target.value);
  }

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
        id={id}
        className={`textarea textarea-bordered resize-none w-full ${height}`}
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
