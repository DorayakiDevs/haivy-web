import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./main.css";
import "./keyframes.css";

import "./global";

import MainApplication from "./app";
import { TestPrint } from "@pages/printable/test";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainApplication />
  </StrictMode>
);
