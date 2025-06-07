import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";

import { UIContextProvider } from "@context/ui";
import { SupabaseProvider } from "@services";

export default function ApplicationProvided({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      <HelmetProvider>
        <BrowserRouter>
          <UIContextProvider>{children}</UIContextProvider>
        </BrowserRouter>
      </HelmetProvider>
    </SupabaseProvider>
  );
}
