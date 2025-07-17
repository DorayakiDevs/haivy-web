import { useEffect, useRef } from "react";

export default function useKeyboardSignals(target?: HTMLElement) {
  const ctrlKey = useRef(false);
  const shiftKey = useRef(false);
  const key = useRef("");

  const setIsCtrl = (c = false) => (ctrlKey.current = c);
  const setIsShift = (c = false) => (shiftKey.current = c);
  const setKey = (c = "") => (key.current = c);

  function getKeyboardEvent(e: Event): KeyboardEvent | 0 {
    if (e instanceof KeyboardEvent) {
      return e;
    }

    return 0;
  }

  function checker(e: Event) {
    const event = getKeyboardEvent(e);
    if (event === 0) return;
    return event;
  }

  function handleKey(event: KeyboardEvent) {
    setIsCtrl(event.ctrlKey);
    setIsShift(event.shiftKey);
    setKey(event.key);
  }

  function handleKeyUp(e: Event) {
    const event = checker(e);
    if (!event) return;

    handleKey(event);
  }

  function handleKeyDown(e: Event) {
    const event = checker(e);
    if (!event) return;

    handleKey(event);
  }

  useEffect(() => {
    const t = target ?? window;

    t.addEventListener("keydown", handleKeyDown);
    t.addEventListener("keyup", handleKeyUp);
    t.addEventListener("blur", handleKeyUp);

    return () => {
      t.removeEventListener("keydown", handleKeyDown);
      t.removeEventListener("keyup", handleKeyUp);
      t.removeEventListener("blur", handleKeyUp);
    };
  }, [target]);

  return {
    ctrlKey: () => ctrlKey.current,
    shiftKey: () => shiftKey.current,
    key: () => key.current,
  };
}
