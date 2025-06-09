import { createContext, useContext, useEffect } from "react";
import { useSearchParams } from "react-router";

const PARAM_NAME = "ext_panel";

type T_SidePanelContext = {
  active: boolean;
  panelId: string;

  open(id: string): void;
  close(): void;
};

const SidePanelContext = createContext<T_SidePanelContext | null>(null);

export function SidePanelProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useSearchParams();

  const active = params.has(PARAM_NAME);
  const panelId = params.get(PARAM_NAME) || "";

  function close() {
    setParams((s) => {
      s.delete(PARAM_NAME);
      return s;
    });
  }

  function open(id: string) {
    if (id === panelId) return;

    setParams((s) => {
      s.set(PARAM_NAME, id);
      return s;
    });
  }

  const value = { active, panelId, close, open };

  return (
    <SidePanelContext.Provider value={value}>
      {children}
    </SidePanelContext.Provider>
  );
}

export function useSidePanel() {
  const data = useContext(SidePanelContext);

  if (!data) {
    throw new Error("useSidePanel must be used within it's provided context");
  }

  return data;
}

export function SidePanelWrapper({
  children,
  onClose = () => {},
  className,
  id,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  id?: string;
  className?: string;
}) {
  const { panelId, close } = useSidePanel();

  const active = !!id && panelId === id;

  useEffect(() => {
    if (active) {
      return;
    }

    onClose();
  }, [active]);

  return (
    <div
      className="h-full overflow-hidden whitespace-nowrap"
      style={{
        width: active ? "35vw" : 0,
        transition: "width 0.2s",
      }}
    >
      <div className="shadow-xl w-full h-full rounded-l-xl relative">
        <div className="p-4 absolute top-0 left-0 z-1">
          <span className="link link-hover text-sm" onClick={close}>
            Close
          </span>
        </div>

        <div
          className={["h-full key-fade-in overflow-x-hidden", className].join(
            " "
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
