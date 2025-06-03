import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";

import App from "./App";

import { SupabaseProvider } from "services/index";
import { UIContextProvider } from "@context/ui/index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SupabaseProvider>
      <HelmetProvider>
        <BrowserRouter>
          <UIContextProvider>
            <App />
          </UIContextProvider>
        </BrowserRouter>
      </HelmetProvider>
    </SupabaseProvider>
  </StrictMode>
);
