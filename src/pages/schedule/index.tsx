import FullscreenLoading from "@pages/others/loading";

import { useServices } from "@services/index";

import PatientSchedulePage from "./patient";
import StaffSchedulePage from "./staff";

export default function SchedulePage() {
  const { auth } = useServices();
  const account = auth.userDetails;

  if (!account) {
    return <FullscreenLoading />;
  }

  const isStaff = account.roles.includes("staff");

  if (isStaff) {
    return <StaffSchedulePage />;
  }

  return <PatientSchedulePage />;
}
