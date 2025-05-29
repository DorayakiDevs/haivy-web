export function LTRLoadingBar({
  speed = "0.6s",
  height,
}: {
  speed?: string;
  height: string | number;
}) {
  return (
    <div className="flex jcctr aictr" style={{ height }}>
      <progress
        className="progress w-[30%] progress-primary"
        style={{
          animationDuration: speed,
        }}
      ></progress>
    </div>
  );
}

export function Tooltips({
  text,
  className = "",
  children,

  dir = "top",
}: {
  text: string;
  className?: string;
  children: React.ReactNode;
  dir?: "top" | "left" | "bottom" | "right";
}) {
  const clssArr = ["tooltip"];

  if (className) clssArr.push(className);

  switch (dir) {
    case "left": {
      clssArr.push("tooltip-left");
      break;
    }
    case "top": {
      clssArr.push("tooltip-top");
      break;
    }
    case "right": {
      clssArr.push("tooltip-right");
      break;
    }
    case "bottom": {
      clssArr.push("tooltip-bottom");
      break;
    }
  }

  return (
    <div className={clssArr.join(" ")} data-tip={text}>
      {children}
    </div>
  );
}
