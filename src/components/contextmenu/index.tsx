import { createContext, useContext, useEffect, useState } from "react";

import ContextMenu from "./ContextMenu";

type AnyObject = { [n: string]: any };

export type ContextMenuDataType = {
  x: number;
  y: number;
  options: Array<Option | null>;
  active: boolean;
  props?: AnyObject;
};

interface ContextMenuType extends ContextMenuDataType {
  toggleMenu: (options: Array<Option | null>, e: React.MouseEvent) => void;
  setActive: (i: boolean) => void;

  // width: number;
}

type Option = {
  text?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  submenu?: Option[];
};

const ContextMenuContext = createContext<ContextMenuType | null>(null);

export function useContextMenu() {
  const value = useContext(ContextMenuContext);
  if (!value) {
    throw new Error("Context Menu must be used inside a provider");
  }

  return value;
}

export function ContextMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [x, setPosX] = useState(0);
  const [y, setPosY] = useState(0);
  const [props, setProps] = useState<AnyObject>({});

  const [active, setActive] = useState(false);

  const [options, setOptions] = useState<Array<Option | null>>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.addEventListener("click", disableMenu);
      window.addEventListener("wheel", disableMenu);
    }, 50);

    if (!active) clearTimeout(timeout);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("wheel", disableMenu);
      window.removeEventListener("click", disableMenu);
    };
  }, [active]);

  function disableMenu() {
    setActive(false);
  }

  function toggleMenu(options: Array<Option | null>, e: React.MouseEvent) {
    setActive(false);
    e.preventDefault();

    setTimeout(() => {
      setPosX(e.clientX);
      setPosY(e.clientY);
      setActive(true);
      setProps(props);

      setOptions(options);
    }, 5);
  }

  const data = { x, y, options, active, toggleMenu, setActive, props };

  return (
    <ContextMenuContext.Provider value={data}>
      {children}
      {active ? <ContextMenu {...data} /> : ""}
    </ContextMenuContext.Provider>
  );
}

export default ContextMenuContext;

export type { Option, ContextMenuType };
