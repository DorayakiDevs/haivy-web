import { useClient } from "@services/client";

import { FullscreenLoading } from "@pages/others/loading";

import StaffSchedulePage from "./staff";
import PatientSchedulePage from "./patient";

export default function SchedulePage() {
  const { account } = useClient();

  if (!account) {
    return <FullscreenLoading />;
  }

  const isStaff = account.roles.includes("staff");

  if (isStaff) {
    return <StaffSchedulePage />;
  }

  return <PatientSchedulePage />;
}
