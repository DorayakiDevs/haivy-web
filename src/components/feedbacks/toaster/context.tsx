import { createContext, useContext, useRef, useState } from "react";

type T_ToasterProps = {
  icon: string;
  color: Style.Color;
  content: string;
  duration: number;
};

type T_OpenProps = Partial<T_ToasterProps>;

type T_ToasterContext = {
  close(): void;
  open(props: T_OpenProps): void;
};

const ToasterContext = createContext<T_ToasterContext | null>(null);

type Timeout = any;

export function ToasterProvider(props: React.ChildrenProps) {
  const timeoutRef = useRef<Timeout>(0);

  const [content, setContent] = useState<string>("This is a toaster");
  const [icon, setIcon] = useState<string>("info");
  const [color, setColor] = useState<Style.Color>("neutral");
  const [active, setActive] = useState(false);

  function cap(c = 0) {
    return Math.max(500, c);
  }

  function open(props: T_OpenProps) {
    const { color, duration, icon, content } = props;

    setContent(content ?? "");
    setIcon(icon ?? "info");
    setColor(color ?? "neutral");
    setActive(true);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(close, cap(duration));
  }

  function close() {
    clearTimeout(timeoutRef.current);
    setActive(false);
  }

  const value = {
    open,
    close,
  };

  // const data = { "}

  return (
    <ToasterContext.Provider value={value}>
      {props.children}
    </ToasterContext.Provider>
  );
}

export default function useToaster() {
  const data = useContext(ToasterContext);
  if (!data) {
    throw new Error("Toaster context not found");
  }

  return data;
}
