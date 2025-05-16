import { useEffect, useState } from "react";
import { Icon } from "../icons";
import { Tooltips } from "./others";

type InputTextProps = {
  icon?: string;
  title?: string;
  placeholder?: string;

  inputClass?: string;
  className?: string;

  children?: React.ReactNode;
  notice?: React.ReactNode;

  type?: "text" | "email" | "password";
  state?: [string, React.Dispatch<React.SetStateAction<string>>];
};

export function InputText(props: InputTextProps) {
  const {
    children,
    notice,
    icon,

    title,
    placeholder,
    inputClass,
    className = "",
    type = "text",

    state,
  } = props;

  const [hidden, setHidden] = useState(true);
  const localState = useState("");

  const [value, setValue] = state || localState;

  const isPassword = type === "password";

  function handleInput(e: any) {
    setValue(e.target.value);
  }

  function clear() {
    setValue("");
  }

  function showPassword() {
    setHidden(false);
  }

  function hidePassword() {
    setHidden(true);
  }

  useEffect(() => {
    if (type !== "password") return;

    document.addEventListener("mouseup", hidePassword);
    window.addEventListener("blur", hidePassword);

    return () => {
      document.removeEventListener("mouseup", hidePassword);
      window.removeEventListener("blur", hidePassword);
    };
  }, [type]);

  return (
    <fieldset className={["fieldset text-1", className].join(" ")}>
      {!title || (
        <legend className="fieldset-legend flex aiend spbtw">
          {title}
          <div className="label float-right">{notice}</div>
        </legend>
      )}
      <div className="flex gap-2">
        <label className={["input flex-1", inputClass].join(" ")}>
          {!icon || <Icon name={icon} size="1rem" />}
          <input
            type={isPassword ? (hidden ? "password" : "text") : type}
            placeholder={placeholder}
            onInput={handleInput}
            onChange={handleInput}
            value={value}
          />
          {!value ||
            (isPassword ? (
              <Icon
                name={hidden ? "visibility" : "visibility_off"}
                size="1.25rem"
                className="clickable"
                onMouseDown={showPassword}
              />
            ) : (
              <Tooltips text="Clear input" className="flex aictr">
                <Icon
                  name="clear"
                  className="clickable"
                  size="1rem"
                  onClick={clear}
                />
              </Tooltips>
            ))}
        </label>
        {children}
      </div>
    </fieldset>
  );
}

export function ErrorableTextInput(props: InputTextProps & { error?: string }) {
  const { error, inputClass, ...rest } = props;

  const clssArr = [inputClass];

  if (error) {
    clssArr.push("input-error");
  }

  return (
    <div>
      <InputText {...rest} inputClass={clssArr.join(" ")} />
      {!error || (
        <span className="text-error text-xs font-semibold">*{error}</span>
      )}
    </div>
  );
}

type InputToggleProps = {
  title?: string;
  defaultChecked?: boolean;
  state?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

export function InputToggle(props: InputToggleProps) {
  const { title, defaultChecked, state } = props;

  const localState = useState(!!defaultChecked);
  const [checked, setChecked] = state || localState;

  function handleInput() {
    setChecked((c) => !c);
  }

  return (
    <fieldset className="fieldset my-4 flex aictr gap-3">
      <input
        type="checkbox"
        className="toggle toggle-info"
        checked={checked}
        onChange={handleInput}
      />
      <label
        className="label text-base-content"
        style={{
          opacity: checked ? 1 : 0.5,
          transition: "opacity 0.1s",
        }}
      >
        {title}
      </label>
    </fieldset>
  );
}
