import { useState } from "react";
import { format, isValid } from "date-fns";

type DatePickerProps = {
  label?: string;
  min?: string;
  max?: string;
  width?: string;
  disabled?: boolean;
  readOnly?: boolean;
  dateOnly?: boolean;
  hideFormatHint?: boolean;
  onChange?: (d: Date) => void;

  state?: [Date, React.Dispatch<React.SetStateAction<Date>>];
};

function renderDatePicker(d: Date = new Date(), dateOnly = false) {
  let f = "yyyy-MM-dd'T'HH:mm";

  if (dateOnly) {
    f = "yyyy-MM-dd";
  }
  ``;
  try {
    return format(d, f);
  } catch {
    return format(new Date(), f);
  }
}

export function DatePicker({
  label,
  min,
  max,
  width = "w-full",
  disabled = false,
  readOnly = false,
  dateOnly = false,
  onChange,
  hideFormatHint = false,
  state,
}: DatePickerProps) {
  const local = useState(new Date());

  const [value, setValue] = state || local;

  function handleChange(e: any) {
    const d = new Date(e.target.value);
    if (!isValid(d)) return;

    setValue(d);
    if (onChange) {
      onChange(d);
    }
  }

  return (
    <div className={`form-control ${width}`}>
      <div className="flex aiend spbtw">
        {!label || (
          <label className="text-sm font-semibold mb-2">
            <span className="label-text">{label}</span>
          </label>
        )}
        {hideFormatHint || (
          <span className="text-xs font-light">
            {dateOnly ? "mm/dd/yyyy" : "mm/dd/yyyy hh:mm --"}
          </span>
        )}
      </div>
      <input
        type={dateOnly ? "date" : "datetime-local"}
        className="input input-bordered w-full read-only:pointer-events-none"
        min={min}
        max={max}
        value={renderDatePicker(value, dateOnly)}
        disabled={disabled}
        onChange={handleChange}
        readOnly={readOnly}
      />
    </div>
  );
}
