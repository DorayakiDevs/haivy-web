import { AlertProvider, useAlert } from "./alert";

import { ContextMenuProvider, useContextMenu } from "@components/contextmenu";
import { SidePanelProvider, useSidePanel } from "./sidepanel";

export function UIContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidePanelProvider>
      <ContextMenuProvider>
        <AlertProvider>{children}</AlertProvider>
      </ContextMenuProvider>
    </SidePanelProvider>
  );
}

export function useUIContext() {
  const alert = useAlert();
  const ctxMenu = useContextMenu();
  const sidepanel = useSidePanel();

  return { alert, ctxMenu, sidepanel };
}
