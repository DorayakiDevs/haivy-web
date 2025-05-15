import "./index.css";

export type COLOR =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export type OUTLINE_STYLE = "dashed" | "solid";

export type SIZE = "sm" | "md" | "lg" | "xl";

export function fetchColorVar(color: COLOR, forContent?: boolean) {
  if (forContent) {
    return `var(--color-${color}-content)`;
  }

  return `var(--color-${color})`;
}

export function fetchSize(size: SIZE) {
  switch (size) {
    case "sm":
      return "0.9em";

    case "md":
      return "1em";

    case "lg":
      return "1.1em";

    case "xl":
      return "1.2em";
  }
}
