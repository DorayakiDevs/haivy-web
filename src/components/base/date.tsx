import { useState } from "react";
import { isValid } from "date-fns";
import { DateUtils } from "@utils/date";

type DatePickerProps = {
  label: string;
  min?: string;
  max?: string;
  width?: string;
  disabled?: boolean;
  readOnly?: boolean;
  dateOnly?: boolean;
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
    return DateUtils.format(d, f);
  } catch {
    return DateUtils.format(new Date(), f);
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
      <div className="flex aiend spbtw my-2">
        <label className="text-sm font-semibold">
          <span className="label-text">{label}</span>
        </label>
        <span className="text-xs font-light">
          {dateOnly ? "mm/dd/yyyy" : "mm/dd/yyyy hh:mm --"}
        </span>
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
