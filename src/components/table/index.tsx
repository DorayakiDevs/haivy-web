import React, { useState, type ReactNode, useEffect } from "react";
import "./index.css";

type RenderFunc<T> = (a: T, i: number) => ReactNode;

type ColProps<T> = {
  header?: ReactNode;
  width?: React.CSSProperties["width"];
  flex?: boolean;
  render?: RenderFunc<T>;
  style?: React.CSSProperties;
  className?: string;
  disableRowActive?: boolean;
};

type Props<RenderElement> = {
  arr: RenderElement[];
  cols: ColProps<RenderElement>[];
  rowHeight?: number;
  top?: number;

  solidHeader?: boolean;
  disableHeader?: boolean;

  rowClassName?: (a: RenderElement, i: number) => string;
  rowStyle?: (a: RenderElement, i: number) => React.CSSProperties;

  onRowClick?: (a: RenderElement, i: number) => void;
  onRowDoubleClick?: (a: RenderElement, i: number) => void;
  onRowContext?: (e: React.MouseEvent, a: RenderElement, i: number) => void;
  onRowsContext?: (
    e: React.MouseEvent,
    a: RenderElement[],
    i: number[]
  ) => void;

  initialActive?: number[];
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

function filterDuplication(str: string) {
  const q: { [n: string]: number } = {};
  const arr = str.split(" ");
  for (let i = 0; i < arr.length; i++) {
    q[arr[i]] = Number.parseInt(arr[i]);
  }

  return Object.values(q);
}

export default function CustomTable<RenderElement>({
  arr = [],
  cols = [],
  rowHeight = 50,
  top = -1,
  solidHeader,
  disableHeader,
  rowClassName = () => "",
  rowStyle = () => ({}),
  onRowClick = () => {},
  onRowDoubleClick = () => {},
  onRowContext = () => {},
  onRowsContext = () => {},
  initialActive = [],
  children = "",

  style = {},
  className = "",
}: Props<RenderElement>) {
  const [activeIndex, setActiveIndex] = useState<number[]>([]);

  const str = initialActive.sort((a, b) => (a > b ? 1 : -1)).join(" ");
  const indexStr = activeIndex.sort((a, b) => (a > b ? 1 : -1)).join(" ");

  function resetActiveIndex() {
    setActiveIndex([]);
  }

  useEffect(() => {
    setActiveIndex(filterDuplication(str));
  }, [str]);

  useEffect(() => {
    setActiveIndex(filterDuplication(indexStr));
  }, [indexStr]);

  useEffect(() => {
    window.addEventListener("click", resetActiveIndex);

    return () => {
      window.removeEventListener("click", resetActiveIndex);
    };
  }, []);

  const clssArr = ["custom-table"];
  clssArr.push(className);

  return (
    <div
      className={clssArr.join(" ")}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={style}
    >
      {disableHeader || (
        <div
          className={"table-header" + (solidHeader ? " solid" : "")}
          style={{
            position: top === -1 ? "relative" : "sticky",
            top: top,
          }}
        >
          {cols.map((col, index) => {
            return (
              <div
                className={["column", col.className ?? ""].join(" ")}
                style={{
                  width: col.width,
                  flex: col.flex ? 1 : "",

                  ...col.style,
                }}
                key={index + "-header-col-" + col.className}
              >
                {col.header}
              </div>
            );
          })}
        </div>
      )}
      <div className="table-content">
        {arr.map((a, i) => {
          const rowClass = rowClassName(a, i);
          if (rowClass.includes("d-hide-it")) {
            return <div style={{ padding: 10, height: rowHeight - 10 }}></div>;
          }

          return (
            <TableItem
              key={"table-item-no:" + i}
              cols={cols}
              item={a}
              index={i}
              height={rowHeight}
              className={rowClass}
              style={rowStyle(a, i)}
              onClick={() => onRowClick(a, i)}
              onDoubleClick={() => onRowDoubleClick(a, i)}
              onContextMenu={(e) => {
                if (activeIndex.length > 1) {
                  onRowsContext(
                    e,
                    activeIndex.map((a) => arr[a]),
                    activeIndex
                  );
                  return;
                }
                onRowContext(e, a, i);
              }}
              active={activeIndex.includes(i)}
              onMouseDown={(e) => {
                if (
                  activeIndex.length > 1 &&
                  activeIndex.includes(i) &&
                  e.button === 2
                ) {
                  return;
                }

                if (e.ctrlKey) {
                  if (activeIndex.includes(i)) {
                    return setActiveIndex((a) => a.filter((q) => q !== i));
                  }
                  return setActiveIndex((a) => [...a, i]);
                }
                if (e.shiftKey) {
                  return setActiveIndex((a) => {
                    const max = Math.max(...a);
                    let m = max,
                      n = i;
                    const c = [...a];
                    if (max > i) {
                      m = i;
                      n = max;
                    }

                    for (let j = m; j <= n; j++) {
                      if (!a.includes(j)) {
                        c.push(j);
                      }
                    }

                    return [...a, ...c];
                  });
                }
                setActiveIndex([i]);
              }}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}

function TableItem<T>({
  cols = [],
  item,
  index,
  height,
  className = "",
  onClick = () => {},
  onDoubleClick = () => {},
  onContextMenu = () => {},
  onMouseDown = () => {},
  style = {},
  active,
}: {
  cols?: ColProps<T>[];
  item: T;
  index: number;
  height: number;
  className?: string;
  onClick?: React.MouseEventHandler;
  onDoubleClick?: React.MouseEventHandler;
  onContextMenu?: React.MouseEventHandler;
  onMouseDown?: React.MouseEventHandler;
  style?: React.CSSProperties;
  active?: boolean;
}) {
  const [holding, setHolding] = useState(false);

  if (holding || active) className += " active";

  const release = () => setHolding(false);

  useEffect(() => {
    if (!holding) return;

    window.addEventListener("mouseup", release);

    return () => {
      window.removeEventListener("mouseup", release);
    };
  }, [holding]);

  return (
    <div
      className={"usn row " + className}
      style={{
        height,

        ...style,
      }}
      onMouseDown={(e) => {
        setHolding(true);
        onMouseDown(e);
      }}
      onMouseOut={release}
      onClick={(e) => {
        if (e.detail === 1) {
          onClick(e);
        } else if (e.detail === 2) {
          onDoubleClick(e);
        }
      }}
      tabIndex={0}
    >
      {cols.map((c, i) => {
        return (
          <div
            className={["flex col", c.className ?? ""].join(" ")}
            style={{
              width: c.width,
              flex: c.flex ? 1 : "",
            }}
            key={"row-table-item-no:" + i + "-" + c.className}
          >
            <div
              className={["flex col ellipsis", c.className ?? ""].join(" ")}
              style={{ width: "calc(100% - 10px)" }}
              onMouseDown={(e) => {
                // if (c.disableRowActive) e.stopPropagation();
              }}
              onClick={(e) => {
                if (c.disableRowActive) e.stopPropagation();
              }}
            >
              {!c.render || c.render(item, index)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type CTColumnProps<T> = ColProps<T>;
