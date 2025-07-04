import { ServiceProvider } from "@services/index";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";

export default function ApplicationProvider({ children }: React.ChildrenProps) {
  return (
    <ServiceProvider>
      <HelmetProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </HelmetProvider>
    </ServiceProvider>
  );
}
