import type { ReactJSXProps } from "react";
import { LTRLoadingBar } from "./others";

type BttProps = ReactJSXProps<"button">;

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
        <button
          className="btn btn-primary"
          onClick={loading ? undefined : onClick}
        >
          {text}
        </button>
        <LTRLoadingBar height={45} />
      </div>
    </div>
  );
}

export function CelebrateButton() {
  return (
    <button className="btn bg-gradient-to-r from-pink-200 to-secondary btn-lg via-yellow-100">
      Celebrate!
    </button>
  );
}
