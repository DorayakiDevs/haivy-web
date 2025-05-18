import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./index.css";

import App from "./App.tsx";

import { SupabaseProvider } from "@auth/index.tsx";
import { UIContextProvider } from "@context/ui/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SupabaseProvider>
      <BrowserRouter>
        <UIContextProvider>
          <App />
        </UIContextProvider>
      </BrowserRouter>
    </SupabaseProvider>
  </StrictMode>
);
