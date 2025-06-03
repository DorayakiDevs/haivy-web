import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

type T_Panel = {
  id: string;
  children: React.ReactNode;
  display?: "inline" | "overlay";
};

type T_PanelRegis = Record<string, T_Panel>;

type T_ExternalPanel = {
  open(id: string): void;
  close(): void;
  active: boolean;
};

type T_InternalExternalPanel = {
  registerPanel(
    id: string,
    children: React.ReactNode,
    display?: T_Panel["display"]
  ): void;
  unregisterPanel(id: string): boolean;
  panels: T_PanelRegis;

  panelId: string;
};

const IntExtPanelCtx = createContext<T_InternalExternalPanel | null>(null);
const ExternalPanelContext = createContext<T_ExternalPanel | null>(null);

function useIntExtPanel() {
  const d = useContext(IntExtPanelCtx);
  if (!d) throw new Error("Internal data is not doing well, please check");

  return d;
}

export function useExternalPanel() {
  const data = useContext(ExternalPanelContext);

  if (!data) {
    throw new Error(
      "useExternalPanel must be used within it's provided provider"
    );
  }

  return data;
}

export function ExternalPanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const PanelRegisRef = useRef<T_PanelRegis>({});

  const [sParams, setSParams] = useSearchParams();
  const [_, setBracketsToUpdate] = useState<{}>({});

  const active = sParams.has("ext_panel");
  const panelId = sParams.get("ext_panel") || "";

  function registerPanel(
    id: string,
    ch: React.ReactNode,
    d?: T_Panel["display"]
  ) {
    if (!id.length) {
      throw new Error("Panel ID must not be empty");
    }

    const panelRegis = PanelRegisRef.current;

    if (panelRegis[id]) {
      console.warn(`Panel [${id}] already registered! OVERRIDING!`);
    }

    const newPanel: T_Panel = { id, children: ch, display: d || "inline" };
    panelRegis[id] = newPanel;

    setBracketsToUpdate({});
  }

  function unregisterPanel(id: string) {
    const panelRegis = PanelRegisRef.current;

    if (!panelRegis[id]) {
      return false;
    }

    delete panelRegis[id];

    setBracketsToUpdate({});
    return true;
  }

  function close() {
    setSParams((s) => {
      s.delete("ext_panel");
      return s;
    });
  }

  function open(id: string) {
    setSParams((s) => {
      s.set("ext_panel", id);
      return s;
    });
  }

  const extVal = { close, open, active };

  const value = {
    registerPanel,
    unregisterPanel,
    panels: PanelRegisRef.current,
    panelId,
  };

  return (
    <IntExtPanelCtx.Provider value={value}>
      <ExternalPanelContext.Provider value={extVal}>
        {children}
      </ExternalPanelContext.Provider>
    </IntExtPanelCtx.Provider>
  );
}

export function ExternalPanelDisplay() {
  const { panels, panelId } = useIntExtPanel();
  const { active, close } = useExternalPanel();

  if (!active) {
    return <div className="w-0 transition-width"></div>;
  }

  const panel = panels[panelId]?.children || <></>;

  return (
    <div className="w-[30vw] h-full transition-width overflow-hidden whitespace-nowrap relative z-0">
      <div className="shadow-xl w-full h-full rounded-l-xl key-fade-in relative">
        <span className="link link-hover absolute text-sm p-4" onClick={close}>
          Close
        </span>
        {panel}
      </div>
    </div>
  );
}

export function ExternalPanelWrapper(props: T_Panel) {
  const { registerPanel, unregisterPanel } = useIntExtPanel();

  const { children, id, display } = props;

  useEffect(() => {
    registerPanel(id, children, display);

    return () => {
      unregisterPanel(id);
    };
  }, [id, display]);

  return null;
}
