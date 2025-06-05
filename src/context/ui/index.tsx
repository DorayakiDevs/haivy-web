import { AlertProvider, useAlert } from "./alert";

export function UIContextProvider({ children }: { children: React.ReactNode }) {
  return <AlertProvider>{children}</AlertProvider>;
}

export function useUIContext() {
  const alert = useAlert();
  return { alert };
}
