import { Helmet } from "react-helmet-async";

import { useClient } from "@services/client";

import { StaffDashboard } from "./staff";
import { PatientDashboard } from "./patient";

export default function DashboardPage() {
  const { account } = useClient();

  function Routing() {
    if (!account) return null;

    const r = account.roles;

    if (r.includes("staff")) {
      return <StaffDashboard />;
    }

    return <PatientDashboard />;
  }

  return (
    <>
      <Helmet>
        <title>Haivy | Dashboard</title>
      </Helmet>
      <Routing />
    </>
  );
}
