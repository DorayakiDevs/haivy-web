import { createContext, useContext } from "react";
import "./index.css";

type T_Column = {
  name?: string;
  value?: number;
  color?: string;
};

type T_ColumnChartProps = {
  columns?: T_Column[];
};

type T_ChartContext = {
  maxValue: number;
};

const ChartContext = createContext<T_ChartContext>({
  maxValue: 0,
});

function useChartContext() {
  return useContext(ChartContext);
}

export default function ColumnChart(props: T_ColumnChartProps) {
  const { columns } = props;

  const maxValue = Math.max(...(columns?.map((col) => col.value || 0) || []));

  const value = { maxValue };

  return (
    <ChartContext.Provider value={value}>
      <div className="dft-col-chart">
        {columns?.map((col) => (
          <ColumnWrapper {...col} />
        ))}
      </div>
    </ChartContext.Provider>
  );
}

function ColumnWrapper({ name, color, value = 0 }: T_Column) {
  const { maxValue } = useChartContext();

  const perf = (100 * value) / maxValue;

  return (
    <div className="col-wrap">
      <div className="col-bar flex coll jcend">
        <div className="tactr font-bold mb-2">{value}</div>
        <div
          className="bar"
          style={{ backgroundColor: color, height: `${perf}%` }}
        ></div>
      </div>
      <div className="col-sep"></div>
      <div className="col-name tactr">
        <sub>{name}</sub>
      </div>
    </div>
  );
}
