import { type CSSProperties } from "react";
import "./index.css";
import { Tooltips } from "@components/base/others";

type Props = {
  name: string;
  size?: CSSProperties["fontSize"];
  fill?: boolean;
  clickable?: boolean;
  cursor?: CSSProperties["cursor"];
} & React.JSXProps<"span">;

export function Icon({
  name,
  size,
  style,
  className,
  color,
  fill,
  clickable,
  cursor,
  onClick,
  title,
  ...spanProps
}: Props) {
  const clssArr = ["dft-icon material-symbols-rounded"];
  if (className) {
    clssArr.push(className);
  }

  const content = (
    <span
      className={clssArr.join(" ")}
      style={{
        ...style,
        fontSize: size,
        userSelect: "none",
        color: color,
        fontVariationSettings: fill
          ? "'FILL' 1, 'wght' 500, 'opsz' 48"
          : "'wght' 500, 'opsz' 48",

        cursor,
        verticalAlign: "middle",
      }}
      onClick={onClick}
      {...spanProps}
    >
      {name}
    </span>
  );

  if (!title) {
    return content;
  }

  return <Tooltips text={title}>{content}</Tooltips>;
}
