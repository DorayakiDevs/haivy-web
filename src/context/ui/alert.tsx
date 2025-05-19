import { useContext, createContext, useRef, useState } from "react";

import { Alert } from "@components/feedback/alert";

type T_AlertProps = {
  type?: "info" | "base" | "success" | "error" | "warning";

  icon?: string;
  text?: string;

  action?: React.ReactNode[];
  duration?: number;
};

type T_AlertMethod = {
  toggle: (props: T_AlertProps) => void;
  close: () => void;
};

const AlertContext = createContext<T_AlertMethod | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const timeRef = useRef(setTimeout(() => {}, 0));

  const [type, setType] = useState<T_AlertProps["type"]>("info");

  const [icon, setIcon] = useState("info");
  const [text, setText] = useState("This is a notification!");

  const [active, setActive] = useState(false);

  function toggle({
    type = "info",
    icon = "info",
    text = "This is a notice",
    duration,
  }: Partial<T_AlertProps>) {
    setType(type);
    setIcon(icon);
    setText(text);

    setActive(true);

    const durBasedOnText = Math.max(2000, text.split(" ").length * 300);

    clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      setActive(false);
    }, duration || durBasedOnText);
  }

  function close() {
    clearTimeout(timeRef.current);
    setActive(false);
  }

  return (
    <AlertContext.Provider value={{ toggle, close }}>
      <div
        className="fixed bottom-32 left-0 z-5 flex aictr jcctr w-full"
        style={{
          pointerEvents: "none",
          opacity: active ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        <div
          onClick={close}
          style={{
            pointerEvents: active ? "all" : "none",
            cursor: active ? "pointer" : "",
          }}
        >
          <Alert type={type} icon={icon}>
            {text}
          </Alert>
        </div>
      </div>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const data = useContext(AlertContext);

  if (!data) {
    throw new Error("useAlert must be used within it's provided context");
  }

  return data;
}
