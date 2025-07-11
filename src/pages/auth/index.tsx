import { Route, Routes, Navigate } from "react-router";
import "./index.css";

import FormLogin from "./login";
import FormRegister from "./signup";

import { LogoLeftSidePreset } from "./components";

export default function AuthenticationPages() {
  return (
    <div className="app-wrapper">
      <LogoLeftSidePreset>
        <Routes>
          <Route path="/login" element={<FormLogin />} />
          <Route path="/register" element={<FormRegister />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </LogoLeftSidePreset>
    </div>
  );
}
