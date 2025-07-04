import { useClient } from "@services/client";

import { FullscreenLoading } from "@pages/others/loading";

import { PatientAppointmentsPage } from "./patient";

export default function AppointmentsPage() {
  const { account } = useClient();

  if (!account) {
    return <FullscreenLoading />;
  }

  return <PatientAppointmentsPage />;
}
