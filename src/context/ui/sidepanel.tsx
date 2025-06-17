import { createContext, useContext, useEffect } from "react";
import { useSearchParams } from "react-router";

const PARAM_NAME = "ext_panel";

type T_SidePanelContext = {
  active: boolean;
  panelId: string;

  open(id: string): void;
  open(id: string, param: Record<string, Stringifiable>): void;
  close(): void;
};

const SidePanelContext = createContext<T_SidePanelContext | null>(null);

// function stringfyStringifiableRecords(r: Record<string, Stringifiable>) {
//   const obj: Record<string, string> = {};
//   for (const s in r) {
//     obj[s] = r.toString();
//   }

//   return obj;
// }

function compareStringRecords(
  param1: Record<string, Stringifiable>,
  param2: Record<string, string>
) {
  console.log(param1);

  const sigParam1 = JSON.stringify(param1, (key, v) => {
    if (!key) return v;

    if (typeof v === "string") {
      return v;
    }

    return v.toString();
  });
  const sigParam2 = JSON.stringify(param2);

  console.log(sigParam1, sigParam2);

  return sigParam1 === sigParam2;
}

function getParamsAsRecord(searchParams: URLSearchParams) {
  const obj: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    obj[key] = value;
  }
  return obj;
}

export function SidePanelProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useSearchParams();

  const active = params.has(PARAM_NAME);
  const panelId = params.get(PARAM_NAME) ?? "";

  function close() {
    setParams((s) => {
      s.delete(PARAM_NAME);
      return s;
    });
  }

  function open(id: string, _ps?: Record<string, Stringifiable>) {
    if (
      compareStringRecords({ ext_panel: id, ..._ps }, getParamsAsRecord(params))
    ) {
      return;
    }

    setParams((s) => {
      s.set(PARAM_NAME, id);

      for (const p in _ps) {
        s.set(p, _ps[p].toString());
      }
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

type T_CloseEvent = {
  clearParams(): void;
};

export function SidePanelWrapper({
  children,
  onClose = () => {},
  className,
  id,
}: {
  children: React.ReactNode;
  onClose?: (e: T_CloseEvent) => void;
  id?: string;
  className?: string;
}) {
  const [_, setParams] = useSearchParams();
  const { panelId, close } = useSidePanel();

  const active = !!id && panelId === id;

  useEffect(() => {
    if (active) {
      return;
    }

    const ev = {
      clearParams() {
        setParams(() => ({}), { replace: true });
      },
    };

    onClose(ev);
  }, [active]);

  if (!active) {
    return (
      <div className="h-full overflow-hidden whitespace-nowrap px-1 w-8 transition-all"></div>
    );
  }

  return (
    <div
      className="h-full overflow-hidden whitespace-nowrap px-1"
      style={{
        width: active ? "37vw" : 0,
        transition: "width 0.2s",
      }}
    >
      <div className="w-full h-full flex coll rounded-l-xl relative">
        <div
          className={[
            "flex-1 key-fade-in overflow-x-hidden p-4 pt-8",
            className,
          ].join(" ")}
        >
          {children}
        </div>

        <div
          className="p-4 z-1 absolute w-full bottom-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, var(--color-base-100) 30%, #fffa)",
          }}
        >
          <button className="btn btn-md btn-ghost w-full" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
