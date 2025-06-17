import { useSelectedIndexes } from "@hooks/helper";
import "./index.css";
import useKeyboardSignals from "@hooks/keyboard";
import { useEffect, useRef } from "react";

type T_NoChildrenProp = Omit<React.JSXProps<"div">, "children">;

type T_ColRender<T> = {
  render: (data: T, index: number) => React.ReactNode;

  header?: React.ReactNode;
  width?: string | number;
  className?: string;
};

type T_TableProps<T> = {
  list?: T[];

  columns: T_ColRender<T>[];

  tableProps?: React.JSXProps<"div">;

  hideHeader?: boolean;
  selectable?: boolean;

  rowsProps?: (item: T, index: number) => React.JSXProps<"div">;

  onRowClick?: (item: T, index: number) => void;
};

export function Table<T>(props: T_TableProps<T>) {
  const lastIndex = useRef(0);

  const activeRows = useSelectedIndexes();
  const keyboard = useKeyboardSignals();

  const {
    tableProps = {},
    list = [],
    columns = [],
    hideHeader,
    selectable,

    rowsProps,

    onRowClick,
  } = props;

  const clssArr = ["dft-table"];

  const { className: tableClassName, ...restTableProps } = tableProps;

  if (tableClassName) {
    clssArr.push(tableClassName);
  }

  function handleRowClick(ri: number) {
    const isActive = activeRows.isActive(ri);
    const ctrl = keyboard.ctrlKey();
    const shift = keyboard.shiftKey();

    try {
      if (ctrl && isActive) {
        activeRows.remove(ri);
        return;
      }

      if (ctrl && !isActive) {
        activeRows.add(ri);
        return;
      }

      if (shift) {
        activeRows.selectRange(ri, lastIndex.current);
        return;
      }

      activeRows.set(ri);
    } finally {
      lastIndex.current = ri;
    }
  }

  return (
    <div
      className={clssArr.join(" ")}
      {...restTableProps}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.ctrlKey && e.key == "a") {
          activeRows.selectRange(0, list.length);
          return;
        }

        if (e.key == "Escape") {
          activeRows.clear();
          return;
        }

        if (e.key == "ArrowDown") {
          let next = lastIndex.current + 1;

          if (e.shiftKey) {
            next = Math.max(...activeRows.list) + 1;
            activeRows.add(next);
          } else {
            activeRows.set(next);
          }

          lastIndex.current = next;
          return;
        }

        if (e.key == "ArrowUp") {
          let next = lastIndex.current - 1;

          if (e.shiftKey) {
            next = Math.min(...activeRows.list) - 1;
            activeRows.add(next);
          } else {
            activeRows.set(next);
          }

          lastIndex.current = next;
          return;
        }
      }}
    >
      <div className="t-header">
        {hideHeader || (
          <TableRow>
            {columns.map((col, i) => {
              return (
                <TableCol width={col.width}>
                  {col.header ?? "Column " + (i + 1)}
                </TableCol>
              );
            })}
          </TableRow>
        )}
      </div>
      <div className="t-body">
        {list.map((row, rowIndex) => {
          const props = rowsProps ? rowsProps(row, rowIndex) : {};

          function onClick() {
            handleRowClick(rowIndex);

            if (onRowClick) {
              onRowClick(row, rowIndex);
            }
          }

          return (
            <TableRow
              {...props}
              onClick={onClick}
              active={activeRows.isActive(rowIndex) && selectable}
            >
              {columns.map((col) => (
                <TableCol width={col.width} className={col.className}>
                  {col.render(row, rowIndex)}
                </TableCol>
              ))}
            </TableRow>
          );
        })}
      </div>
    </div>
  );
}

function TableCol(props: {
  children: React.ReactNode;
  width?: number | string;
  className?: string;
}) {
  const clssArr = ["t-col whitespace-nowrap overflow-hidden text-ellipsis"];

  if (props.className) {
    clssArr.push(props.className);
  }

  return (
    <div
      className={clssArr.join(" ")}
      style={{
        width: props.width,
        flex: props.width ? "" : 1,
        minWidth: 0,
      }}
    >
      {props.children}
    </div>
  );
}

function TableRow(props: React.JSXProps<"div"> & { active?: boolean }) {
  const { className, children, active, ...rest } = props;
  const clssArr = ["t-row"];

  if (className) {
    clssArr.push(className);
  }

  if (active) {
    clssArr.push("active");
  }

  return (
    <div className={clssArr.join(" ")} {...rest}>
      {children}
    </div>
  );
}
