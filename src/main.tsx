import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import ApplicationProvided from "provider";
import RoutedApplication from "routers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApplicationProvided>
      <RoutedApplication />
    </ApplicationProvided>
  </StrictMode>
);
