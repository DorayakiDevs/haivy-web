export function LTRLoadingBar({ speed = "0.6s" }: { speed?: string }) {
  return (
    <div className="flex jcctr py-4">
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
