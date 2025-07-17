import { Frame } from "@pages/appointments/component";

import { TestResultsDisplay } from "@components/features/testlab";
import { Loading } from "@components/icons/loading";

import { useRPC } from "@hooks/useRPC";

import { useAptDetails } from "../hooks/useAppointmentDetails";
import { Icon } from "@components/icons/google";
import { Button } from "@components/shared/buttons";
import { Link } from "react-router";
import { useServices } from "@services/index";
import { includesAny } from "@utils/validator";

export function PatientTestOrderFrame() {
  const { auth } = useServices();
  const roles = auth.userDetails?.roles ?? [];

  const canRequest = includesAny(roles, [
    "administrator",
    "doctor",
    "manager",
    "staff",
  ]);

  const { details } = useAptDetails();

  if (!details) {
    return (
      <Frame className="flex-1 content-ctr">
        <Loading size="xl" />
      </Frame>
    );
  }

  const fetcher = useRPC("get_test_results_by_appointment", {
    appointment_id: details?.appointment_id,
  });

  if (fetcher.status !== "success") {
    return (
      <Frame className="flex-1 content-ctr">
        <Loading size="xl" />
      </Frame>
    );
  }

  const { data } = fetcher;
  const LINK = `/appointments/${details.appointment_id}/lab_request`;

  return (
    <Frame className="flex-1">
      <div className="flex spbtw">
        Test results
        <div>{data.length} tests</div>
      </div>

      {data.length ? (
        <div className="mt-4 overflow-y-auto">
          {data.map((test) => {
            return <TestResultsDisplay results={test} />;
          })}
        </div>
      ) : (
        <div className="content-ctr gap-8 coll m-auto">
          <Icon name="science_off" size="3rem" />
          No test record found
        </div>
      )}

      {!canRequest || (
        <Link to={LINK} className="mx-auto mt-4">
          <Button className="btn-primary">
            <Icon name="send" />
            Request test
          </Button>
        </Link>
      )}
    </Frame>
  );
}
