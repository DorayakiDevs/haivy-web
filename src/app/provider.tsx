import { ToasterProvider } from "@components/feedbacks/toaster/context";
import { SidePanelProvider } from "@components/modals/sidepanel";
import { ServiceProvider } from "@services/index";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router";

export default function ApplicationProvider({ children }: React.ChildrenProps) {
  return (
    <ServiceProvider>
      <HelmetProvider>
        <BrowserRouter>
          <SidePanelProvider>
            <ToasterProvider>{children}</ToasterProvider>
          </SidePanelProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ServiceProvider>
  );
}
