import { useClient } from "@services/client";

import { StaffDashboard } from "./staff";
import { PatientDashboard } from "./patient";

export default function DashboardPage() {
  const { account } = useClient();

  const type = account?.account_type || "";

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
