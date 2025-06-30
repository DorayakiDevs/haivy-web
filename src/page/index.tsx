import { Route, Routes } from "react-router";

import DashboardPage from "./dashboard";
import TicketsPage from "./tickets";
import SettingsPage from "./settings";
import SchedulePage from "./schedules";
import MedicationPanel from "./medication";
import AuthenticationPage from "./auth";

import { VerticalNavigationBar } from "./components";

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
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/medication" element={<MedicationPanel />} />
        </Routes>
      </div>
    </div>
  );
}

export { AuthenticationPage as AuthenticationRouter };
