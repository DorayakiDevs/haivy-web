import { useState } from "react";

import {
  QualitativeBadge,
  QuantitiveBadge,
  TestResultsDisplay,
} from "@components/features/testlab";
import { Loading } from "@components/icons/loading";
import { Table } from "@components/tables";
import { InputText } from "@components/shared/text";
import { Button } from "@components/shared/buttons";

import { useRPC } from "@hooks/useRPC";
import useUI from "@hooks/useUI";

import { useServices } from "@services/index";

import { parseError } from "@utils/parser";

import { useAptDetails } from "../hooks/useAppointmentDetails";
import { Helmet } from "react-helmet-async";

export function TestRequestPanel() {
  const { details, reload: reloadDetails } = useAptDetails();
  const { appointment_id } = details;

  const testsFetcher = useRPC("query_tests", { q: "" });
  const resultsFetcher = useRPC("get_test_results_by_appointment", {
    appointment_id,
  });

  const query = useState("");

  function reload() {
    resultsFetcher.reload();
    reloadDetails(true);
  }

  return (
    <div className="content-wrapper overflow-hidden px-8 pb-8 flex coll gap-8">
      <Helmet>
        <title>Haivy | Appointment - Tests Request</title>
      </Helmet>
      <div className="py-4 mt-4">
        <div className="text-md mb-2">
          Appointment • {details.content} • Test lab
        </div>
        <div className="text-2xl font-medium">Submit Test Requests</div>
      </div>

      <div className="flex-1 flex">
        <div className="content-ctr h-full flex-4 overflow-y-auto">
          {resultsFetcher.status !== "success" ? (
            <Loading />
          ) : resultsFetcher.data.length ? (
            <div className="w-full h-full">
              {resultsFetcher.data.map((r) => (
                <TestResultsDisplay results={r} />
              ))}
            </div>
          ) : (
            "No tests requested"
          )}
        </div>
        <div className="flex-6 px-4 overflow-y-auto">
          {testsFetcher.status !== "success" ? (
            <div className="content-ctr h-full">
              <Loading />
            </div>
          ) : (
            <>
              <div className="sticky top-0 z-2">
                <InputText
                  state={query}
                  className="my-2"
                  placeholder="Search for tests . . ."
                />
              </div>
              <Table
                list={testsFetcher.data.filter((t) => {
                  const str = `${t.name} ${t.description}`.toLowerCase();
                  return str.includes(query[0].toLowerCase());
                })}
                hideHeader
                columns={[
                  {
                    render(t) {
                      return <TestTypeDisplay test={t} reload={reload} />;
                    },
                  },
                ]}
                rowsProps={() => ({
                  className: "h-22 hover:shadow-md p-2! transition-all",
                })}
                emptyPlaceholder={`Cannot find test with keyword: '${query[0]}'`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TestTypeDisplay({
  test,
  reload,
}: {
  test: Haivy.TestType;
  reload(): void;
}) {
  const { toaster } = useUI();
  const { details } = useAptDetails();
  const { client } = useServices();

  const [loading, setLoading] = useState(false);

  async function request() {
    setLoading(true);

    const { error } = await client.rpc("request_test", {
      appointment_id: details.appointment_id,
      test_type: test.id,
    });

    if (error) {
      toaster.error(parseError(error));
    } else {
      toaster.success("Test requested succesdfully");
      reload();
    }

    setLoading(false);
  }

  return (
    <div className="flex aictr gap-4">
      {
        <Button loading={loading} onClick={request}>
          Request
        </Button>
      }
      <div className="flex-1">
        <div className="flex aictr spbtw">
          <div className="text-md font-semibold">{test.name} </div>
          <div className="flex aictr gap-2">
            {test.result_type === "boolean" ? (
              <QualitativeBadge />
            ) : (
              <>
                <QuantitiveBadge />
                <span className="badge badge-primary">{test.unit || "-"}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-sm">{test.description}</div>
      </div>
    </div>
  );
}
