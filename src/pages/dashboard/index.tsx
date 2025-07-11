import { Helmet } from "react-helmet-async";

import { useServices } from "@services/index";

import { StaffDashboard } from "./staff";
import CustomerDashboard from "./customer";

export default function DashboardPage() {
  const { auth } = useServices();
  const account = auth.userDetails;

  function Routing() {
    if (!account) return null;

    const r = account.roles;

    if (r.includes("staff")) {
      return <StaffDashboard />;
    }

    return <CustomerDashboard />;
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
