import { Helmet } from "react-helmet-async";

import { useClient } from "@services/client";

import { StaffDashboard } from "./staff";
import { PatientDashboard } from "./patient";

export default function DashboardPage() {
  const { account } = useClient();

  const type = account?.account_type || "";

  function Routing() {
    switch (type) {
      case "staff": {
        return <StaffDashboard />;
      }
      case "patient": {
        return <PatientDashboard />;
      }

      default: {
        return "";
      }
    }
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
