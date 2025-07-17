import { createContext, useContext, useMemo, useRef, useState } from "react";
import "./index.css";

import { Icon } from "@components/icons/google";

import useSelectedIndexes from "@hooks/useSelectableIndexes";
import useKeyboardSignals from "@hooks/useKeyboardSignal";

type T_ColRender<T> = {
  render: (data: T, index: number) => React.ReactNode;

  header?: React.ReactNode;
  width?: string | number;
  className?: string;

  sortBy?: (row: T) => any;
  disableSort?: boolean;
};

type T_TableProps<T> = {
  list?: T[];

  columns: T_ColRender<T>[];

  tableProps?: React.JSXProps<"div">;

  hideHeader?: boolean;
  selectable?: boolean;

  defaultSortCol?: number;
  defaultSortDir?: T_SortDir;

  rowsProps?: (
    item: T,
    index: number,
    isActive: boolean
  ) => React.JSXProps<"div">;
  onRowClick?: (item: T, index: number, isActive: boolean) => void;

  emptyPlaceholder?: React.ReactNode;
};

type T_SortDir = "asc" | "desc";

type T_TableContext = {
  sortIndex: number;
  sortDir: T_SortDir;
  toggleSort(colIndex: number, dir?: T_SortDir): void;
};

const TableContext = createContext<T_TableContext>({
  sortIndex: -1,
  sortDir: "asc",
  toggleSort() {
    throw new Error("Not implemented");
  },
});

const arrowName = {
  desc: "arrow_drop_down",
  asc: "arrow_drop_up",
};

export function Table<T>(props: T_TableProps<T>) {
  const lastIndex = useRef(0);

  const activeRows = useSelectedIndexes();
  const keyboard = useKeyboardSignals();

  const [sortIndex, setSortIndex] = useState<number>(
    props.defaultSortCol ?? -1
  );

  const [sortDir, setSortDir] = useState<T_SortDir>(
    props.defaultSortDir ?? "desc"
  );

  const {
    tableProps = {},
    list = [],
    columns = [],
    hideHeader,
    selectable,

    rowsProps,
    onRowClick,

    emptyPlaceholder = "List is empty",
  } = props;

  const clssArr = ["dft-table key-fade-in"];

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

  function toggleSort(index: number, dir: T_SortDir = "asc") {
    setSortDir(dir);
    setSortIndex(index);
  }

  const sortedList = useMemo(() => {
    if (sortIndex === null || !columns[sortIndex]?.sortBy) return list ?? [];

    const accessor = columns[sortIndex].sortBy!;

    return [...(list ?? [])].sort((a, b) => {
      const va = accessor(a);
      const vb = accessor(b);

      const result = va < vb ? -1 : va > vb ? 1 : 0;

      return sortDir === "asc" ? result : -result;
    });
  }, [list, sortIndex, sortDir, columns]);

  const value = {
    sortDir,
    sortIndex,
    toggleSort,
  };

  return (
    <TableContext.Provider value={value}>
      {list.length ? (
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
            {hideHeader ?? (
              <TableRow>
                {columns.map((col, i) => {
                  return (
                    <TableCol
                      width={col.width}
                      header
                      colIndex={i}
                      sortable={!!col.sortBy}
                      className={col.className}
                      key={i}
                    >
                      {col.header ?? "Column " + (i + 1)}
                    </TableCol>
                  );
                })}
              </TableRow>
            )}
          </div>
          <div className="t-body">
            {sortedList.map((row, rowIndex) => {
              const props = rowsProps
                ? rowsProps(row, rowIndex, activeRows.isActive(rowIndex))
                : {};

              function onClick() {
                handleRowClick(rowIndex);

                if (onRowClick) {
                  onRowClick(row, rowIndex, activeRows.isActive(rowIndex));
                }
              }

              return (
                <TableRow
                  {...props}
                  onClick={onClick}
                  active={activeRows.isActive(rowIndex) && selectable}
                  key={rowIndex}
                >
                  {columns.map((col, colIndex) => (
                    <TableCol
                      width={col.width}
                      className={col.className}
                      colIndex={colIndex}
                      key={colIndex}
                    >
                      {col.render(row, rowIndex)}
                    </TableCol>
                  ))}
                </TableRow>
              );
            })}

            <div className="tactr p-4"> - End of the list - </div>
          </div>
        </div>
      ) : (
        <div className="dft-table">
          <div className="t-header">
            {hideHeader ?? (
              <TableRow>
                {columns.map((col, i) => {
                  return (
                    <TableCol
                      width={col.width}
                      header
                      colIndex={i}
                      className={col.className}
                      sortable={!!col.sortBy}
                      key={i}
                    >
                      {col.header ?? "Column " + (i + 1)}
                    </TableCol>
                  );
                })}
              </TableRow>
            )}
          </div>
          <div className="content-ctr py-24">{emptyPlaceholder}</div>
        </div>
      )}
    </TableContext.Provider>
  );
}

function TableCol(props: {
  children: React.ReactNode;
  width?: number | string;
  header?: boolean;
  className?: string;
  colIndex: number;
  sortable?: boolean;
}) {
  const clssArr = ["w-full overflow-hidden"];

  if (props.className) {
    clssArr.push(props.className);
  }

  return (
    <div
      className="t-col whitespace-nowrap text-ellipsis flex aictr gap-2"
      style={{
        width: props.width,
        flex: props.width ? "" : 1,
        minWidth: 0,
      }}
    >
      {props.header && props.sortable ? (
        <SortPanel children={props.children} colIndex={props.colIndex} />
      ) : (
        <div className={clssArr.join(" ")}>{props.children}</div>
      )}
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

function SortPanel({
  children,
  colIndex,
}: {
  children: React.ReactNode;
  colIndex: number;
}) {
  const { toggleSort, sortDir, sortIndex } = useContext(TableContext);

  function sortAsc() {
    toggleSort(colIndex, "asc");
  }

  function sortDesc() {
    toggleSort(colIndex, "desc");
  }

  const getSortClss = (dir: T_SortDir) => {
    let str = "w-full p-2 btn btn-sm spbtw";
    if (dir === sortDir && colIndex === sortIndex) {
      str += " btn-primary";
    }

    return str;
  };

  return (
    <div className="dropdown dropdown-start dropdown-bottom text-base-content w-full">
      <label tabIndex={0} className="text-base-100 w-full flex aictr">
        <div className="link link-hover">{children}</div>
        {sortIndex !== colIndex || (
          <Icon name={arrowName[sortDir]} size="1.5rem" />
        )}
      </label>
      <div
        tabIndex={0}
        className="dropdown-content z-5 menu p-4 shadow bg-base-100 rounded-lg w-64 space-y-4"
      >
        <div className="flex coll gap-2">
          <div>Sort</div>

          <button className={getSortClss("asc")} onClick={sortAsc}>
            <Icon name="sort" className="rotate-180" />
            <span className="font-semibold">Sort Ascending</span>
          </button>
          <button className={getSortClss("desc")} onClick={sortDesc}>
            <Icon name="sort" />
            <span className="font-semibold">Sort Descending</span>
          </button>
        </div>

        <div className="flex coll gap-2">
          <div>Filter</div>
          <i className="font-light tactr">Feature not available</i>
        </div>
      </div>
    </div>
  );
}
