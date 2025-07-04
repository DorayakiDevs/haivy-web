import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";

import DashboardPage from "./dashboard";
import TicketsPage from "./tickets";
import SettingsPage from "./settings";
import SchedulePage from "./schedules";
import MedicationPanel from "./medication";
import AuthenticationPage from "./auth";
import AppointmentsPage from "./appointments";

import { VerticalNavigationBar } from "./components";
import { NotFoundPage } from "./others/notfound";

export default function AuthorizedRouter() {
  // return <TestPanel />;

  return (
    <div className="app-wrapper flex aictr">
      <VerticalNavigationBar />

      <div className="relative z-1 flex-1 h-full overflow-hidden">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/:id" element={<TicketsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/:id" element={<AppointmentsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/medication" element={<MedicationPanel />} />
          <Route path="/login" element={<Navigate />} />
          <Route path="/register" element={<Navigate />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

function Navigate() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <></>;
}

export { AuthenticationPage as AuthenticationRouter };
