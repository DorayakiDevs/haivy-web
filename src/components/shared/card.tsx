import { Icon } from "@components/icons/google";

type Props = React.JSXProps<"div">;

type T_Action = {
  title: string;
  onClick?: React.MouseEventHandler;
};

type T_CardContent = React.ReactNode;
type T_CardTitle = React.ReactNode;
type T_CardSize = "xs" | "sm" | "md" | "lg" | "xs";

export function Card(props: Props) {
  const { className, ...rest } = props;

  const clssArr = ["card bg-base-100"];

  if (className) {
    clssArr.push(className);
  }

  return <div className={clssArr.join(" ")} {...rest} />;
}

type T_ActionCardProps = {
  subtitle?: string;
  subIcon?: string;

  tag?: React.ReactNode;
  description?: React.ReactNode;
  details?: T_CardContent;

  title?: T_CardTitle;
  actions?: T_Action[];
} & React.JSXProps<"div">;

export function ActionCard(props: T_ActionCardProps) {
  const {
    subtitle,
    subIcon,
    tag,
    description,
    details,
    title,
    actions = [],
    className,
    style,
    ...rest
  } = props;

  return (
    <div
      className={[
        "card-expand card bg-base-200 w-80 rounded-lg p-4 gap-3",
        className,
      ].join(" ")}
      style={{ border: "2px solid #0001", ...style }}
      {...rest}
    >
      <div className="subhead flex aictr spbtw gap-1 text-xs">
        <div className="flex aictr gap-2 text-xs">
          <Icon name={subIcon || ""} size="1.5em" />
          {subtitle}
        </div>
        {tag}
      </div>
      <div className="text-clip overflow-hidden mt-2">
        <div className="card-title text-md">{title}</div>
        <div className="text-sm font-semibold">{description}</div>
      </div>
      <div className="content text-sm my-3 overflow-hidden flex-1">
        {details}
      </div>
      {!title || (
        <div className="actions flex aictr gap-2">
          {actions.map((action, i) => {
            return (
              <button
                className="btn-sm btn btn-primary flex-1"
                onClick={action.onClick}
                key={i}
              >
                {action.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ImageCard({
  content,
  title,
  url,
  size = "md",
  actions = [],
  className,
  active,
  ...props
}: {
  content?: T_CardContent;
  title: T_CardTitle;
  url: string;
  size?: T_CardSize;
  active?: boolean;
  actions?: T_Action[];
} & React.JSXProps<"div">) {
  const clssArr = ["card shadow-sm card-sm hover-wrapper"];

  switch (size) {
    case "xs": {
      clssArr.push("card-xs");
      break;
    }
    case "sm": {
      clssArr.push("card-sm");
      break;
    }
    case "md": {
      clssArr.push("card-md");
      break;
    }
    case "lg": {
      clssArr.push("card-lg");
      break;
    }

    default: {
      clssArr.push("card-md");
    }
  }

  if (className) {
    clssArr.push(className);
  }

  if (active) {
    clssArr.push("active bg-primary text-primary-content");
  }

  return (
    <div
      className={clssArr.join(" ")}
      style={{ transition: "all 0.1s" }}
      {...props}
    >
      <div
        style={{
          height: 180,
          width: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#fff",
          backgroundImage: `linear-gradient(to top, ${
            active ? "#0000" : "#fffa"
          } 30px, #0001) ,url('${url}'), url('${Constant.IMG_PLACEHOLDER}')`,
        }}
      ></div>
      <div className="card-body selectable-text">
        <h2 className="card-title">{title}</h2>
        <p className="card-content">{content}</p>
      </div>
      {!actions || (
        <div className="card-actions p-2 show-on-hover">
          {actions.map((action, index) => {
            const className = "btn btn-primary w-full btn-sm btn-outline";

            return (
              <button
                key={index}
                className={className}
                onClick={action.onClick}
              >
                {action.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
