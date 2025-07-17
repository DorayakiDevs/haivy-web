import { Routes, Route, Navigate } from "react-router";

import { NavigationBar } from "./components";

import DashboardPages from "./dashboard";
import TicketPages from "./tickets";
import AppointmentPages from "./appointments";
import SchedulePages from "./schedule";

import AuthenticationPages from "./auth";
import NotFoundPage from "./others/notfound";
import MedicationPages from "./medicines";
import TestLabPages from "./testlab";
import MedicalRecordsPages from "./patients";

function AuthenticatedPage() {
  return (
    <div className="app-wrapper flex">
      <NavigationBar />

      <Routes>
        <Route path="/" element={<DashboardPages />} />

        <Route path="/tickets/*" element={<TicketPages />} />

        <Route path="/appointments" element={<AppointmentPages />} />
        <Route path="/appointments/*" element={<AppointmentPages />} />

        <Route path="/schedule" element={<SchedulePages />} />

        <Route path="/medication" element={<MedicationPages />} />

        <Route path="/labs" element={<TestLabPages />} />
        <Route path="/records" element={<MedicalRecordsPages />} />
        <Route path="/records/:id" element={<MedicalRecordsPages />} />

        <Route path="/login" element={<NavBack />} />
        <Route path="/register" element={<NavBack />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function NavBack() {
  return <Navigate to="/" replace />;
}

export { AuthenticationPages, AuthenticatedPage };
