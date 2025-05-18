import { LTRLoadingBar } from "./others";

type BttProps = React.JSX.IntrinsicElements["button"];

export function Button(props: BttProps) {
  const { className, ...rest } = props;

  const clssArr = ["btn"];

  if (className) {
    clssArr.push(className);
  }

  return <button {...rest} className={clssArr.join(" ")} />;
}

export function SubmitWithLoading({
  loading,
  onClick,
  text,
}: {
  loading?: boolean;
  onClick?: React.MouseEventHandler;
  text?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden h-[45px] my-4">
      <div
        className="flex coll"
        style={{
          transform: loading ? "translateY(-45px)" : "",
          transition: "all 0.1s",
        }}
      >
        <div
          className="btn btn-primary"
          onClick={loading ? undefined : onClick}
        >
          {text}
        </div>
        <LTRLoadingBar height={45} />
      </div>
    </div>
  );
}
