import { Tooltips } from "@components/base/others";
import { Icon } from "@components/icons";
import { useEffect, useState } from "react";

type SlideOverlayProps = {
  onClose?: () => void;
  onOpen?: () => void;
  close?: () => void;

  isOpen?: boolean;
  children?: React.ReactNode;
};

export function SlideOverlayPanel({
  children,
  isOpen,
  onClose = () => {},
  onOpen = () => {},

  close = () => {},
}: SlideOverlayProps) {
  const [render, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      if (onOpen) onOpen();
    } else {
      if (onClose) onClose();
    }
  }, [isOpen]);

  if (!render) return;

  function handleAnimationEnd() {
    if (isOpen) return;
    setRender(false);
  }

  const clssArr = [
    "w-1/2 h-full bg-base-100 rounded-md px-4 text-sm overflow-auto",
  ];

  if (isOpen) {
    clssArr.push("key-slide-right-in");
  } else {
    clssArr.push("key-slide-right-out");
  }

  return (
    <div
      className="fixed h-full w-full z-7 top-0 right-0 flex jcend"
      style={{
        backgroundColor: isOpen ? "#000a" : "#0000",
        pointerEvents: isOpen ? "all" : "none",
        transition: "background-color 0.2s",
      }}
      onClick={close}
      onAnimationEnd={handleAnimationEnd}
    >
      {!isOpen || (
        <div>
          <Tooltips text="Close" dir="left">
            <button className="btn btn-square m-4 btn-white" onClick={close}>
              <Icon name="close" />
            </button>
          </Tooltips>
        </div>
      )}

      <div className={clssArr.join(" ")} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
