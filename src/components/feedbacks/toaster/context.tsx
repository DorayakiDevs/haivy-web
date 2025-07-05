import { createContext, useContext, useRef, useState } from "react";
import Toaster from "./component";

export type T_ToasterProps = {
  icon: string;
  color: Style.Color;
  content: string;
};

type T_OpenProps = Partial<T_ToasterProps>;

type T_ToasterContext = {
  close(): void;
  open(props: T_OpenProps): void;

  error(content?: string, duration?: number): void;
  note(content?: string, duration?: number): void;
  success(content?: string, duration?: number): void;
};

const ToasterContext = createContext<T_ToasterContext | null>(null);

type Timeout = any;

export function ToasterProvider(props: React.ChildrenProps) {
  const timeoutRef = useRef<Timeout>(0);

  const [content, setContent] = useState<string>("This is a toaster");
  const [icon, setIcon] = useState<string>("info");
  const [color, setColor] = useState<Style.Color>("neutral");
  const [active, setActive] = useState(false);

  function cap(c = 2000) {
    return Math.max(500, c);
  }

  function open(props: T_OpenProps & { duration?: number }) {
    const { color, duration, icon, content } = props;

    setContent(content ?? "");
    setIcon(icon ?? "info");
    setColor(color ?? "neutral");
    setActive(true);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(close, cap(duration));
  }

  function error(content = "An error occured", duration = 2000) {
    open({ content, color: "error", icon: "error", duration });
  }

  function success(content: string, duration = 2000) {
    open({ content, color: "success", icon: "check_circle", duration });
  }

  function note(content: string, duration = 2000) {
    open({ content, color: "neutral", icon: "note", duration });
  }

  function close() {
    clearTimeout(timeoutRef.current);
    setActive(false);
  }

  const value = {
    open,
    close,
    error,
    success,
    note,
  };

  const data = { content, color, icon, active };

  return (
    <ToasterContext.Provider value={value}>
      {props.children}
      <Toaster {...data} active={active} />
    </ToasterContext.Provider>
  );
}

export function useToaster() {
  const data = useContext(ToasterContext);
  if (!data) {
    throw new Error("Toaster context not found");
  }

  return data;
}
