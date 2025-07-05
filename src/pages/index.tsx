import { Routes, Route, Navigate } from "react-router";

import { NavigationBar } from "./components";

import DashboardPages from "./dashboard";
import AuthenticationPages from "./auth";

import NotFoundPage from "./others/notfound";

function AuthenticatedPage() {
  return (
    <div className="app-wrapper flex">
      <NavigationBar />

      <Routes>
        <Route path="/" element={<DashboardPages />} />

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
