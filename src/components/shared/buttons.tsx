import { Loading } from "@components/icons/loading";

import { merge } from "@utils/string";

type T_Props = {
  loading?: boolean;
  width?: string;
  size?: Style.Size;
  color?: Style.Color;
  look?: T_BtnStyle;
  disabled?: boolean;
} & React.JSXProps<"button">;

type T_BtnStyle = "outline" | "ghost";

function translateSize(size?: Style.Size) {
  switch (size) {
    case "xs":
      return "btn-xs";
    case "sm":
      return "btn-sm";
    case "lg":
      return "btn-lg";
    case "xl":
      return "btn-xl";

    default:
    case "md":
      return "btn-md";
  }
}

function translateColor(color?: Style.Color) {
  switch (color) {
    case "primary":
      return "btn-primary";
    case "secondary":
      return "btn-secondary";
    case "accent":
      return "btn-accent";
    case "info":
      return "btn-info";
    case "success":
      return "btn-success";
    case "warning":
      return "btn-warning";
    case "error":
      return "btn-error";
    case "neutral":
      return "btn-neutral";
    default:
      return "";
  }
}

function translateType(type?: T_BtnStyle) {
  switch (type) {
    case "outline":
      return "btn-outline";
    case "ghost":
      return "btn-ghost";

    default:
      return "";
  }
}

export function Button(props: T_Props) {
  const {
    className,
    disabled,
    loading,
    children,
    size,
    color,
    look,
    width,
    ...rest
  } = props;

  const arr = [className];

  if (loading || disabled) {
    arr.push("btn-disabled");
  }

  const cSize = translateSize(size);
  const cColor = translateColor(color);
  const cType = translateType(look);

  const clss = merge("btn", ...arr, width, cSize, cColor, cType);

  return (
    <button className={clss} {...rest}>
      {loading ? <Loading type="spinner" /> : children}
    </button>
  );
}
