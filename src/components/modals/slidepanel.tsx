import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";

import { IconButton } from "@components/shared/buttons";

import useNav from "@hooks/useNav";

export function SlidePanelWrapper(
  props: React.ChildrenProps & { className?: string; path: string }
) {
  const { className = "w-1/2", path, children } = props;

  const nav = useNav();

  const [closing, setClosing] = useState(false);

  function close() {
    setClosing(true);
  }

  function closeForReal() {
    nav(-1);
    setClosing(false);
  }

  useEffect(() => {
    if (!closing) return;

    const timeout = setTimeout(closeForReal, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [closing]);

  const clssArr = ["float-content rounded-box"];
  clssArr.push(className);

  if (closing) {
    clssArr.push("closing");
  }

  return (
    <Routes>
      <Route
        path={path}
        element={
          <div className="float-content-wrapper flex jcend">
            <div className="m-4">
              <IconButton
                icon="close"
                color="primary"
                title="Close panel"
                dir="right"
                onClick={close}
              />
            </div>
            <div className={clssArr.join(" ")}>{children}</div>
          </div>
        }
      />
    </Routes>
  );
}
