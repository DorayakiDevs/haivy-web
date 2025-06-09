import "./index.css";

type T_NoChildrenProp = Omit<React.JSXProps<"div">, "children">;

type T_ColRender<T> = {
  render: (data: T, index: number) => React.ReactNode;

  header?: React.ReactNode;
  width?: string | number;
};

type T_TableProps<T> = {
  list?: T[];

  columns: T_ColRender<T>[];

  tableProps?: React.JSXProps<"div">;

  rowProps?: T_NoChildrenProp;
};

export function Table<T>(props: T_TableProps<T>) {
  const { tableProps = {}, rowProps = {}, list = [], columns = [] } = props;

  const clssArr = ["dft-table"];

  const { className: tableClassName, ...restTableProps } = tableProps;

  if (tableClassName) {
    clssArr.push(tableClassName);
  }

  return (
    <div className={clssArr.join(" ")} {...restTableProps}>
      <div className="t-header">
        <TableRow>
          {columns.map((col, i) => {
            return (
              <TableCol width={col.width}>
                {col.header || "Column " + (i + 1)}
              </TableCol>
            );
          })}
        </TableRow>
      </div>
      <div className="t-body">
        {list.map((row, rowIndex) => {
          const props = { ...rowProps };

          return (
            <TableRow {...props}>
              {columns.map((col) => (
                <TableCol width={col.width}>
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
}) {
  return (
    <div
      className="t-col whitespace-nowrap overflow-hidden text-ellipsis"
      style={{
        width: props.width,
        flex: props.width ? "" : 1,
      }}
    >
      {props.children}
    </div>
  );
}

function TableRow(props: React.JSXProps<"div">) {
  const { className, children, ...rest } = props;
  const clssArr = ["t-row"];

  if (className) {
    clssArr.push(className);
  }

  return (
    <div className={clssArr.join(" ")} {...rest}>
      {children}
    </div>
  );
}
