import { Icon } from "@components/icons";

export function Alert({
  type = "info",
  icon = "info",
  children = "",
}: {
  type?: "info" | "base" | "success" | "error" | "warning";
  icon?: string;

  children?: React.ReactNode;
}) {
  let className = "alert-info";

  switch (type) {
    case "info": {
      className = "alert-info";
      break;
    }
    case "base": {
      className = "alert-base";
      break;
    }
    case "success": {
      className = "alert-success";
      break;
    }
    case "error": {
      className = "alert-error";
      break;
    }
    case "warning": {
      className = "alert-warning";
      break;
    }
  }

  return (
    <div
      role="alert"
      className={"alert pr-6 " + className}
      style={{
        boxShadow: "#3369 0px 13px 27px -5px, #000a 0px 8px 16px -8px",
        maxWidth: "calc(50vw)",
      }}
    >
      <div className="flex aictr gap-4">
        <Icon name={icon} />
        {children}
      </div>
    </div>
  );
}
