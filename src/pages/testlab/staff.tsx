import { useState } from "react";
import { compareDesc, format } from "date-fns";

import { Icon } from "@components/icons/google";
import { Table } from "@components/tables";

import FullscreenLoading from "@pages/others/loading";
import ErrorHandlerPage from "@pages/others/error";

import { useRPC } from "@hooks/useRPC";

import { groupTestResultsByAppointments } from "@utils/parser";

import { AppointmentTestDetails } from "./details";
import { Tooltip } from "@components/shared/tooltip";
import { Helmet } from "react-helmet-async";

export default function StaffTestLabPage() {
  const fetcher = useRPC("get_all_tests_for_authenticated_user");

  const [currentID, setCurrentID] = useState("");

  if (fetcher.status === "loading" || fetcher.status === "idle") {
    return <FullscreenLoading />;
  }

  if (fetcher.status === "error") {
    return <ErrorHandlerPage error={fetcher.error} />;
  }

  const appts = groupTestResultsByAppointments(fetcher.data);
  const list = Object.values(appts).sort((a, b) =>
    compareDesc(a.created_date, b.created_date)
  );

  const current = appts[currentID];

  return (
    <div className="content-wrapper flex">
      <Helmet>
        <title>Haivy | Test Lab</title>
      </Helmet>
      <div className="flex-1 flex coll">
        <div className="py-4 mt-8 mb-4">
          <div className="flex aictr gap-4">
            <Icon name="experiment" size="3em" />
            <div>
              <div className="text-3xl font-semibold mb-2">Test Lab</div>
            </div>
          </div>
        </div>
        <div className="flex-1 h-full overflow-y-scroll">
          <div className="sticky top-0 z-2 bg-base-100 pb-2 ">
            <div className="text-lg">Appointments</div>
            <div className="text-md">
              Showing {list.length} appointment ({fetcher.data.length} tests)
            </div>
          </div>
          <Table
            selectable
            list={list}
            hideHeader
            columns={[
              {
                render(a) {
                  const total = a.tests.length;
                  const done = a.tests.filter((t) => t.value !== null);

                  return (
                    <div className="flex aictr spbtw px-2">
                      <div>
                        <div className="font-medium">{a.content}</div>
                        <div className="text-sm">
                          Created at:
                          {format(a.meeting_date, " dd.MM.yyyy - kk:mm")}
                        </div>
                      </div>

                      <div className="flex aictr gap-4">
                        {done.length === total ? (
                          <CompleteIcon />
                        ) : (
                          <PendingIcon />
                        )}
                        <span className="font-mono text-sm">
                          {done.length}/{total} test
                        </span>
                      </div>
                    </div>
                  );
                },
              },
            ]}
            onRowClick={(a) => {
              setCurrentID(a.appointment_id);
            }}
            tableProps={{ className: "pt-4" }}
            rowsProps={(_, __, a) => ({
              style: { height: 80, transform: "none" },
              className: a
                ? "bg-primary! text-primary-content my-3!"
                : "border-1 my-3!",
            })}
          />
        </div>
      </div>

      <div className="flex-[1.2] my-4">
        <AppointmentTestDetails details={current} />
      </div>
    </div>
  );
}

function PendingIcon() {
  return (
    <Tooltip title="Pending" dir="left">
      <div className="w-8 h-8 content-ctr rounded-full bg-warning text-white">
        <Icon name="pending" fill />
      </div>
    </Tooltip>
  );
}

function CompleteIcon() {
  return (
    <Tooltip title="Complete" dir="left">
      <div className="w-8 h-8 content-ctr rounded-full bg-success text-white">
        <Icon name="done" fill />
      </div>
    </Tooltip>
  );
}
