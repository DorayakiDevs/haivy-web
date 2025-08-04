import { Icon } from "@components/icons/google";
import "./index.css";

import PrintableHeader from "./header";

import type { groupTestResultsByAppointments } from "@utils/parser";
import { format } from "date-fns";
import { TestResultsDisplay } from "@components/features/testlab";

type T_Details = ReturnType<typeof groupTestResultsByAppointments>[string];

export function TestPrint({
  details,
  contentRef,
}: {
  details: T_Details;
  contentRef: any;
}) {
  const date = format(new Date(), "dd.MM.yyyy - kk:mm:ss");

  const tests = details.tests.filter((c) => c.value != null);

  return (
    <div className="printable" ref={contentRef}>
      <PrintableHeader />

      <section className="patient-info">
        <h2>Basic Information</h2>
        <div className="flex gap-12">
          <div className="flex coll flex-1">
            <div className="flex spbtw">
              <strong>Patient Name:</strong> John Doe
            </div>
            <div className="flex spbtw">
              <strong>Age:</strong> 26
            </div>
            <div className="flex spbtw">
              <strong>Sex:</strong> Male
            </div>
          </div>

          <div className="flex coll flex-1">
            <div className="flex spbtw">
              <strong>Test completed:</strong> {tests.length}/
              {details.tests.length}
            </div>
            <div className="flex spbtw">
              <strong>Complete at:</strong> {date}
            </div>
            <div className="flex spbtw">
              <strong>Printed at:</strong> {date}
            </div>
          </div>
        </div>
      </section>

      <section className="test-summary">
        <h2>Test Details</h2>

        {tests.map((results, _) => (
          <div className="border-1 bg-base-100/60 border-base-content/20 p-2 px-4 rounded-field my-2 flex aictr spbtw border-l-6">
            <div className="w-2/3 flex-1">
              <strong>
                {_ + 1}. {results.test_type.name} (
                {results.test_type.unit || "-"})
              </strong>
              <div>{results.test_type.description}</div>
            </div>

            <div className="flex coll w-45">
              <strong>Range </strong>
              <div className="font-mono">
                [{results.test_type.lower_threshold?.toLocaleString()}
                {" - "}
                {results.test_type.upper_threshold?.toLocaleString()}]
              </div>
            </div>

            <div className="flex coll w-24">
              <strong>Value </strong>
              <div className="font-mono">{results.value.toLocaleString()}</div>
            </div>
          </div>
        ))}
        <div className="tactr text-xs mt-8">
          End of list ({tests.length} test)
        </div>
      </section>

      <footer className="flex aictr spbtw absolute bottom-0 left-0 w-full p-6">
        <p className="flex coll">
          <strong>Generated on</strong>
          {format(new Date(), "EEEE, MMMM dd, yyyy")}
        </p>
        <p className="flex coll text-right">
          <strong>Signed by</strong> The Haivy Medical Test Team
        </p>
      </footer>
    </div>
  );
}
