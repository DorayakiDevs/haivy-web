import { AlertProvider, useAlert } from "./alert";
import { ExternalPanelProvider, useExternalPanel } from "./extpanel";

export function UIContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <ExternalPanelProvider>
      <AlertProvider>{children}</AlertProvider>
    </ExternalPanelProvider>
  );
}

export function useUIContext() {
  const alert = useAlert();
  const extPanel = useExternalPanel();
  return { alert, extPanel };
}
