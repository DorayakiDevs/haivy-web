import "./index.css";

import { fetchColorVar, type COLOR, type OUTLINE_STYLE } from "../utils";

type Props = {
  color?: COLOR;
  outline?: OUTLINE_STYLE;
} & React.JSX.IntrinsicElements["div"];

export default function Badge(props: Props) {
  const { color = "primary", outline } = props;

  const background = fetchColorVar(color);
  const contentColor = fetchColorVar(color, !outline);

  return (
    <div
      className="dft-badge"
      style={{
        backgroundColor: outline ? "#0000" : background,
        color: contentColor,

        border: `var(--border) ${outline || "solid"} ${
          background || contentColor
        }`,
        fontSize: "1em",
      }}
    >
      {props.children}
    </div>
  );
}
