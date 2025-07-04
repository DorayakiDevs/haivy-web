import { Icon } from "@components/icons/google";

import { merge } from "@utils/string";

function translateColor(color?: Style.Color) {
  switch (color) {
    case "primary":
      return "alert-primary";
    case "secondary":
      return "alert-secondary";
    case "accent":
      return "alert-accent";
    case "info":
      return "alert-info";
    case "success":
      return "alert-success";
    case "warning":
      return "alert-warning";
    case "error":
      return "alert-error";

    default:
    case "neutral":
      return "alert-neutral";
  }
}

export default function Toaster() {
  return (
    <div className="toast toast-center h-32">
      <div className={merge("alert")}>
        <Icon name="info" />
        <span>New mail arrived.</span>
      </div>
    </div>
  );
}
