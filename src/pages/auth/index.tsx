import { Route, Routes } from "react-router";
import "./index.css";

import Toaster from "@components/feedbacks/toaster/component";

import { Navigate } from "@components/routing";

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
          <Route path="*" element={<Navigate path="/login" replace />} />
        </Routes>
      </LogoLeftSidePreset>
      <Toaster />
    </div>
  );
}
