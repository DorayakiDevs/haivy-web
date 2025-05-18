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
}: {
  text: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={["tooltip", className].join(" ")} data-tip={text}>
      {children}
    </div>
  );
}
