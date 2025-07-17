import { useEffect, useRef, useState } from "react";

type T_DraggableRetVal = {
  onMouseDown: React.MouseEventHandler;

  props: { style: React.CSSProperties } & Partial<React.JSXProps<"div">>;

  offsetX: number;
  offsetY: number;

  holding: boolean;
  ref: any;
};

export default function useDraggable(
  fillMode: "forward" | "backward" = "backward"
): T_DraggableRetVal {
  const oldMouse = useRef([0, 0]);
  const eleRef = useRef<HTMLElement | null>(null);

  const [offset, setOffset] = useState([0, 0]);
  const [holding, setHolding] = useState(false);

  function onMouseDown(e: React.MouseEvent) {
    const { clientX, clientY } = e;
    setHolding(true);

    oldMouse.current = [clientX, clientY];
  }

  function onMouseMove(e: MouseEvent) {
    if (!holding) return;
    const [orX, orY] = oldMouse.current;

    let movementX = e.clientX - orX;
    let movementY = e.clientY - orY;

    oldMouse.current = [e.clientX, e.clientY];

    setOffset(([a, b]) => [a + movementX, b + movementY]);
  }

  function onMouseUp() {
    setHolding(false);

    if (fillMode === "forward") {
      return;
    }

    setOffset([0, 0]);
  }

  useEffect(() => {
    if (holding) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("blur", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("blur", onMouseUp);
    };
  }, [holding, fillMode]);

  const [tx, ty] = offset;

  return {
    onMouseDown,

    props: {
      style: {
        transform: `translate(${tx}px, ${ty}px)`,
        transition: holding ? "" : "all 0.3s",
      },
      draggable: "false",
      onDragStart: (e) => {
        e.stopPropagation();
        e.preventDefault();
      },
    },

    offsetX: tx,
    offsetY: ty,

    holding,
    ref: eleRef as any,
  };
}
