import { merge } from "@utils/string";

export function Frame(props: React.ChildrenProps & { className?: string }) {
  return (
    <div
      className={`border-2 shadow-lg border-[#0001] rounded-box my-2 p-4 flex coll bg-base-100 first-child-header ${props.className}`}
    >
      {props.children}
    </div>
  );
}

export function InfoRow({
  icon,
  name,
  desc,
  className,
  ...props
}: Partial<Record<"icon" | "name" | "desc", React.ReactNode>> &
  React.JSXProps<"div">) {
  return (
    <div className={merge("flex aictr my-3 gap-4", className)} {...props}>
      <div className="">{icon}</div>
      <div>
        <div className="text-md font-semibold">{name}</div>
        <div className="text-sm">{desc}</div>
      </div>
    </div>
  );
}
