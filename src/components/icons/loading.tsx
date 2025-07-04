import { merge } from "@utils/string";

type T_LoadStyle = "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";

type T_Props = {
  type?: T_LoadStyle;
  size?: Style.Size;
  color?: Style.Color;
  className?: string;
};

function translateSize(size?: Style.Size) {
  switch (size) {
    case "xs":
      return "loading-xs";
    case "sm":
      return "loading-sm";
    case "lg":
      return "loading-lg";
    case "xl":
      return "loading-xl";

    default:
    case "md":
      return "loading-md";
  }
}

function translateColor(dir?: Style.Color | undefined) {
  switch (dir) {
    case "primary":
      return "text-primary";
    case "secondary":
      return "text-secondary";
    case "accent":
      return "text-accent";
    case "info":
      return "text-info";
    case "success":
      return "text-success";
    case "warning":
      return "text-warning";
    case "error":
      return "text-error";
    case "neutral":
      return "text-neutral";
    default:
      return "";
  }
}

function translateType(type?: T_LoadStyle) {
  switch (type) {
    case "dots":
      return "loading-dots";
    case "ring":
      return "loading-ring";
    case "ball":
      return "loading-ball";
    case "bars":
      return "loading-bars";
    case "infinity":
      return "loading-infinity";

    default:
    case "spinner":
      return "loading-spinner";
  }
}

export function Loading(props: T_Props) {
  const { type, color, size, className } = props;

  const cColor = translateColor(color);
  const cSize = translateSize(size);
  const cType = translateType(type);

  const clss = merge("loading", cColor, cSize, cType, className);

  return <span className={clss}></span>;
}
