import { merge } from "@utils/string";

type T_Props = {
  dir?: Style.Direction;
  color?: Style.Color;
} & React.JSXProps<"div">;

function translateDir(dir: Style.Direction | undefined) {
  switch (dir) {
    case "bottom":
      return "tooltip-bottom";

    case "left":
      return "tooltip-left";

    case "top":
      return "tooltip-top";

    default:
    case "right":
      return "tooltip-right";
  }
}

function translateColor(dir: Style.Color | undefined) {
  switch (dir) {
    case "primary":
      return "tooltip-primary";
    case "secondary":
      return "tooltip-secondary";
    case "accent":
      return "tooltip-accent";
    case "info":
      return "tooltip-info";
    case "success":
      return "tooltip-success";
    case "warning":
      return "tooltip-warning";
    case "error":
      return "tooltip-error";

    default:
    case "neutral":
      return "tooltip-neutral";
  }
}

export function Tooltip(props: T_Props) {
  const { className, children, dir, color, ...rest } = props;

  let cColor = translateColor(color);
  let cDir = translateDir(dir);

  const clss = merge("tooltip", className, cDir, cColor);

  return (
    <div className={clss} {...rest} data-tip={props.title}>
      {children}
    </div>
  );
}
