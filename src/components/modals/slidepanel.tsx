import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";

import { IconButton } from "@components/shared/buttons";

export function SlidePanelWrapper(
  props: React.ChildrenProps & {
    className?: string;
    path: string;
    basePath?: string;
  }
) {
  const { className = "w-1/2", path, children } = props;

  const nav = useNavigate();

  const [closing, setClosing] = useState(false);

  function close() {
    setClosing(true);
  }

  function closeForReal() {
    if (props.basePath) {
      nav(props.basePath, { replace: true });
    } else {
      nav(-1);
    }
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
