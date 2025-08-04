import { Icon } from "@components/icons/google";
import { IconButton } from "@components/shared/buttons";

import { roundToLocal } from "@utils/converter";
import { merge } from "@utils/string";

type T_Results = Haivy.DBFunc<"get_test_results_by_appointment">["Returns"][0];

function getPercentage(
  value: number,
  lower: number,
  upper: number | null
): number {
  if (upper === null) return 0.5;

  if (upper === lower) return 0;

  const percent = ((value - lower) / (upper - lower)) * 100;
  return Math.min(100, Math.max(0, percent)) / 100;
}

export function TestResultsDisplay(props: { results: T_Results }) {
  const { test_type, value, notes } = props.results;

  const qualitative = test_type.result_type === "boolean";
  const lower = test_type.lower_threshold;
  const upper = test_type.upper_threshold;

  return (
    <div className="mb-4 p-3 border-1 border-base-300 rounded-field">
      <div>
        <div className="flex aictr spbtw">
          <div className="text-md">
            {test_type.name} {test_type.unit ? `(${test_type.unit})` : ""}
          </div>
          <div className="flex aictr gap-2">
            {value === null ? <BadgePending /> : <BadgeComplete />}
          </div>
        </div>
        <sub>{test_type.description}</sub>
      </div>

      {value === null ||
        (qualitative ? (
          <div
            className={merge(
              "mt-4 badge rounded-md w-full",
              value ? "badge-error" : "badge-success"
            )}
          >
            Results: {value ? "Positive" : "Negative"}
          </div>
        ) : (
          <div className="mt-4 text-xs">
            <div className="h-3 rounded-full border-1 border-base-300 bg-primary flex aictr">
              <div
                style={{
                  width: 100 * getPercentage(value, lower, upper) + "%",
                }}
              ></div>
              <div
                className="border-1 border-primary w-1 bg-white rounded-full"
                style={{
                  height: "calc(100% + 8px)",
                }}
              ></div>
              <div
                style={{
                  transform: "translate(-50%, 100%)",
                }}
                className="text-sm"
              >
                {roundToLocal(value)}
              </div>
            </div>
            <div className="flex aictr spbtw">
              <span>{roundToLocal(lower)}</span>
              <span>{upper ?? roundToLocal(value * 2 - lower)}</span>
            </div>
          </div>
        ))}

      <div className="mt-4 text-xs">
        <span>
          Note: {notes || <span className="text-black/60"> (none) </span>}
        </span>
      </div>
    </div>
  );
}

function BadgeComplete() {
  return (
    <span className="badge badge-success badge-sm py-3">
      <Icon name="check" />
      Complete
    </span>
  );
}

function BadgePending() {
  return (
    <span className="badge badge-warning badge-sm py-3">
      <Icon name="pending" />
      Pending
    </span>
  );
}

export const QualitativeBadge = () => (
  <span className="badge badge-sm bg-blue-600 text-white">Qualitative</span>
);

export const QuantitiveBadge = () => (
  <span className="badge badge-sm bg-green-700 text-white">Quantitive</span>
);
