import { compareDesc, format } from "date-fns";

import ErrorHandlerPage from "@pages/others/error";
import FullscreenLoading from "@pages/others/loading";

import { useRPC } from "@hooks/useRPC";

import { groupTestResultsByAppointments } from "@utils/parser";
import { TestResultsDisplay } from "@components/features/testlab";
import { Icon } from "@components/icons/google";

export default function PatientTestLabPages() {
  const fetcher = useRPC("get_all_tests_for_authenticated_user");

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

  return (
    <div className="content-wrapper flex coll">
      <div className="py-4 my-8 pb-0">
        <div className="flex aictr gap-4">
          <Icon name="experiment" size="3em" />
          <div>
            <div className="text-2xl font-medium">Your Tests</div>
            <div>Showing total of: {list.length} tests</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {list.length ? (
          list.map((app) => (
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 my-2">
              <input type="radio" name="my-accordion-1" defaultChecked />
              <div className="collapse-title">
                <div className="font-semibold">Appointment: {app.content}</div>
                <div>
                  {format(app.meeting_date, "EEEE, MMMM dd, yyyy - kk:mm")} (
                  {app.tests.filter((q) => q.value !== null).length}/
                  {app.tests.length} tests complete)
                </div>
              </div>
              <div className="collapse-content grid grid-cols-3 gap-4">
                {app.tests.map((r) => (
                  <TestResultsDisplay results={r} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full content-ctr coll gap-16">
            <Icon name="more_horiz" size="4em" />
            <div className="text-lg">You have not done any test</div>
          </div>
        )}
      </div>
    </div>
  );
}
