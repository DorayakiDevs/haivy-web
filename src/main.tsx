import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";

import App from "./App.tsx";

import { SupabaseProvider } from "services/index.tsx";
import { UIContextProvider } from "@context/ui/index.tsx";

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
