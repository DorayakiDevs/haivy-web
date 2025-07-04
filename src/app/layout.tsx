import { Route, Routes } from "react-router";
import "./index.css";

import { useServices } from "@services/index";

import NotFoundPage from "@pages/others/notfound";
import DashboardPages from "@pages/dashboard";
import FullscreenLoading from "@pages/others/loading";
import AuthenticationPages from "@pages/auth";

export default function ApplicationLayout() {
  const { auth } = useServices();

  if (auth.loading) {
    return <FullscreenLoading />;
  }

  if (!auth.user) {
    return <AuthenticationPages />;
  }

  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<DashboardPages />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
