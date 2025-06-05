import { useState } from "react";
import { isValid, format as rawfmt } from "date-fns";

type DatePickerProps = {
  label: string;
  min?: string;
  max?: string;
  width?: string;
  disabled?: boolean;

  state?: [Date, React.Dispatch<React.SetStateAction<Date>>];
};

function format(d: Date = new Date()) {
  try {
    return rawfmt(d, "yyyy-MM-dd'T'HH:mm");
  } catch {
    return rawfmt(new Date(), "yyyy-MM-dd'T'HH:mm");
  }
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  min,
  max,
  width = "w-full",
  disabled = false,
  state,
}) => {
  const local = useState(new Date());

  const [value, setValue] = state || local;

  function handleChange(e: any) {
    const d = new Date(e.target.value);
    if (!isValid(d)) return;

    setValue(d);
  }

  return (
    <div className={`form-control ${width}`}>
      <div className="flex aiend spbtw my-2">
        <label className="text-sm font-semibold">
          <span className="label-text">{label}</span>
        </label>
        <span className="text-xs font-light">mm/dd/yyyy</span>
      </div>
      <input
        type="datetime-local"
        className="input input-bordered w-full"
        min={min}
        max={max}
        value={format(value)}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
};
