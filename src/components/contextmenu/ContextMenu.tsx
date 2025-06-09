import { useEffect, useRef, useState } from "react";
import "./index.css";

import type { ContextMenuDataType } from "./index";
import { Icon } from "@components/icons";

interface Props extends ContextMenuDataType {
  // width?: number;
}

// const options = [
//   { text: "Play artist discography", onClick: () => {} },
//   { text: "Go to artist radio", onClick: () => {} },
//   { text: "Start artist radio", onClick: () => {} },
//   { text: "Follow", onClick: () => {} },
// ];

export default function ContextMenu({
  options = [],
  x = 0,
  y = 0,
  props = {},
}: Props) {
  const self = useRef(null);

  const [overflowX, setOverflowX] = useState(false);
  const [overflowY, setOverflowY] = useState(false);

  useEffect(() => {
    const t = self.current as HTMLElement | null;

    if (t) {
      const { width, height } = t.getBoundingClientRect();

      setOverflowX(width + x > window.innerWidth);
      setOverflowY(height + y > window.innerHeight);

      t.focus();
    }
  }, [x, y]);

  let subClass = "submenu";
  const getStyle = () => {
    const dft: React.CSSProperties = {
      top: "unset",
      left: "unset",
      right: "unset",
      bottom: "unset",

      // width: width || "",
    };

    if (overflowX) {
      dft.right = 20;
      subClass += " overflow-x";
    } else {
      dft.left = x;
    }

    if (overflowY) {
      dft.bottom = 20;
      subClass += " overflow-y";
    } else {
      dft.top = y;
    }

    return dft;
  };

  const clssArr = ["main-context-menu fade-in", props.className ?? ""];

  return (
    <div
      className={clssArr.join(" ")}
      style={getStyle()}
      id="no-delete-context"
      ref={self}
      onScroll={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onClick={props.onClick}
    >
      {options.map((option, index) => {
        if (option === null) {
          return <div className="hr" key={"Hr-" + index}></div>;
        }

        const submenuLength =
          option.submenu?.filter((a) => !a.disabled).length ?? -1;

        if (option?.disabled || submenuLength === 0)
          return (
            <div
              className="option br5 usn flex aictr disabled"
              key={"ctx-opt-" + index}
            >
              {!option.icon || (
                <div className="flex aictr icon">{option.icon}</div>
              )}
              {option.text}
            </div>
          );

        const optClssArr = ["option rounded-md flex aictr"];
        if (option.submenu) optClssArr.push("extending");

        return (
          <div
            className={optClssArr.join(" ")}
            onClick={option.onClick}
            key={"COPT=" + index}
            tabIndex={1}
          >
            {!option.icon || (
              <div className="flex aictr icon">{option.icon}</div>
            )}
            <div className="flex spbtw aictr flex-1">
              <div className="ellipsis text">{option.text}</div>
              {option.submenu ? <Icon name="chevron_right" /> : ""}
            </div>
            {option.submenu ? (
              <div className={subClass}>
                <ContextMenu
                  options={option.submenu}
                  active
                  x={0}
                  y={0}
                  props={props}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        );
      })}
    </div>
  );
}
