import "./index.css";

import {
  fetchSize,
  fetchColorVar,
  type COLOR,
  type OUTLINE_STYLE,
  type SIZE,
} from "../utils";

type BttProps = {
  color?: COLOR;
  outline?: OUTLINE_STYLE;

  size?: SIZE;
  active?: boolean;
  disabled?: boolean;
  block?: boolean;

  radius?: string;
} & React.JSX.IntrinsicElements["button"];

export function Button(props: BttProps) {
  const {
    className,
    style,
    color = "neutral",
    outline,
    radius = "var(--radius-field)",
    size = "md",

    block,

    active,
    disabled,
    children,
  } = props;

  const clssArr = ["dft-btt"];

  if (className) {
    clssArr.push(className);
  }

  if (active) {
    clssArr.push("active");
  }

  if (disabled) {
    clssArr.push("disabled");
  }

  const background = fetchColorVar(color);
  const contentColor = fetchColorVar(color, !outline);

  return (
    <button
      className={clssArr.join(" ")}
      {...props}
      style={{
        backgroundColor: outline ? "#0000" : background,
        color: contentColor,

        borderRadius: radius,
        border: `var(--border) ${outline || "solid"} ${
          background || contentColor
        }`,
        padding: fetchSize(size),
        fontSize: fetchSize(size),

        display: block ? "block" : "",

        ...style,
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
