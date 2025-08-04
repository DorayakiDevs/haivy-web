import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

import {
  QualitativeBadge,
  QuantitiveBadge,
} from "@components/features/testlab";
import { Icon } from "@components/icons/google";
import { Button, IconButton } from "@components/shared/buttons";
import { InputTextErrorable } from "@components/shared/text";

import { useServices } from "@services/index";

import useUI from "@hooks/useUI";

import { parseError, type groupTestResultsByAppointments } from "@utils/parser";
import { TestPrint } from "@pages/printable/test";

type T_Details = ReturnType<typeof groupTestResultsByAppointments>[string];

export function AppointmentTestDetails({ details }: { details?: T_Details }) {
  if (!details) {
    return (
      <div className="h-full mx-4 border-1 border-dashed rounded-box">
        <div className="content-ctr h-full">
          Select a test to view it's details
        </div>
      </div>
    );
  }

  const { tests, appointment_id } = details;

  const contentRef = useRef<HTMLDivElement>(null);
  const printTestResults = useReactToPrint({
    documentTitle: `test_results_${appointment_id}`,
    contentRef,
  });

  const [printMode, setPrintMode] = useState(false);

  function togglePrintMode() {
    setPrintMode(true);
  }

  function closePrintMode() {
    setPrintMode(false);
  }

  useEffect(closePrintMode, [appointment_id]);

  const totalCount = tests.length;
  const doneCount = tests.filter((t) => t.value !== null).length;

  if (printMode) {
    return (
      <div className="px-4 h-full fade-in flex coll">
        <div className="flex aictr spbtw">
          <div className="text-lg font-medium">Print Preview</div>
          <div className="p-2 flex aictr gap-2">
            <Button className="btn-ghost" onClick={closePrintMode}>
              <Icon name="close" />
              Close
            </Button>
            <Button color="primary" onClick={printTestResults}>
              <Icon name="print" />
              Print
            </Button>
          </div>
        </div>
        <TestPrint details={details} contentRef={contentRef} />
      </div>
    );
  }

  return (
    <div
      className="h-full mx-4 border-1 rounded-box p-4 fade-in flex coll"
      key={details.appointment_id}
    >
      <div className="flex aictr spbtw">
        <div className="mt-4">
          <div className="subhead-text m-0!">
            Showing {totalCount} tests for
          </div>
          <Link
            to={"/appointments/" + details.appointment_id}
            className="link link-hover"
          >
            <Icon name="link" className="mr-2" />
            Appointment {details.content} • Date:{" "}
            {format(details.meeting_date, "dd.MM.yyyy - kk:mm")}
          </Link>
        </div>
        <Button onClick={togglePrintMode}>
          <Icon name="print" />
          Preview Print
        </Button>
      </div>

      <div className="my-4">
        <div className="text-md my-2 flex aictr gap-6">
          Test list ({doneCount}/{totalCount} completed)
          <div className="border-b-[1px] flex-1 mt-1 opacity-30"></div>
        </div>
      </div>

      <div className="overflow-y-auto overflow-x-hidden">
        {details.tests.map((test) => {
          return <TestFrame test={test} />;
        })}
      </div>
    </div>
  );
}

function TestFrame({ test }: { test: T_Details["tests"][0] }) {
  const { client } = useServices();
  const { toaster } = useUI();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const defValue = (test.value ?? "").toString();
  const input = useState(defValue);

  const value = parseFloat(input[0]) ?? -1;
  const lower = test.test_type.lower_threshold;
  const upper = test.test_type.upper_threshold ?? Infinity;

  const qualitative = test.test_type.result_type === "boolean";

  const inputIsValid = qualitative
    ? value === lower || value === upper
    : value >= lower && value <= upper;

  function enableEdit() {
    setEditMode(true);
  }

  function disableEdit() {
    setEditMode(false);
    input[1](defValue);
  }

  async function saveValue() {
    if (loading) return;
    if (!inputIsValid) return;

    setLoading(true);

    const { error } = await client.rpc("update_test_results", {
      id: test.id,
      value: value,
    });

    if (error) {
      toaster.error(parseError(error));
    } else {
      toaster.success("Test result updated successfully!");
      test.value = value;
    }

    disableEdit();
    setLoading(false);
  }

  return (
    <div className="flex aictr rounded-field h-24 mb-4 shadow-md">
      <div
        className={
          "w-3 h-full mr-3 rounded-l-field " +
          (defValue ? "bg-success" : "bg-warning")
        }
      ></div>

      <div className="flex-1">
        <div className="text-lg flex aictr gap-4">
          {test.test_type.name}
          {qualitative ? <QualitativeBadge /> : <QuantitiveBadge />}
        </div>
        <div className="text-md">
          <Threashold lower={lower} upper={upper} isBoolean={qualitative} />
        </div>

        <div className="text-xs link link-hover mt-2">
          <Link to={"/tickets/" + test.ticket.ticket_id}>
            <Icon name="link" /> Support ticket link
          </Link>
        </div>
      </div>

      <div className="flex aiart gap-4 mr-4">
        {editMode ? (
          <div>
            <InputTextErrorable
              width="w-28"
              maxLength={10}
              autoComplete="off"
              list="wow"
              placeholder={test.test_type.unit}
              state={input}
              error={inputIsValid ? "" : "Not in range"}
            />
          </div>
        ) : (
          <div className="text-md my-auto">
            <span className="text-lg">
              {test.value?.toLocaleString() || " - "}{" "}
            </span>
            {test.test_type.unit}
          </div>
        )}

        <div className="gap-2 flex">
          {!editMode ? (
            <IconButton
              title="Edit"
              icon="edit"
              className="btn-secondary"
              onClick={enableEdit}
            />
          ) : (
            <>
              <IconButton
                title="Save"
                icon="save"
                className="btn-success"
                onClick={saveValue}
                disabled={!inputIsValid || defValue === input[0]}
                loading={loading}
              />
              <IconButton
                title="Discard"
                icon="close"
                className="btn-warning"
                onClick={disableEdit}
                disabled={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Threashold({
  lower,
  upper,
  isBoolean,
}: {
  lower: number;
  upper: number;
  isBoolean?: boolean;
}) {
  if (isBoolean) {
    return <span>Value: 0 or 1</span>;
  }

  return (
    <span>
      Value range: [{lower < 0 || <span>Min: {lower.toLocaleString()}</span>}
      {lower < 0 || upper >= Infinity || <span> | </span>}
      {upper >= Infinity || <span>Max: {upper.toLocaleString()}</span>}]
    </span>
  );
}
