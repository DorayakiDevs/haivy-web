import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./main.css";
import "./keyframes.css";

import MainApplication from "./app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainApplication />
  </StrictMode>
);
