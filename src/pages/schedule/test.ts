type Position = "top" | "bottom" | "left" | "right";

interface PositionResult {
  top: number;
  left: number;
}

export function getBestPosition(
  top: number,
  left: number,
  ref: HTMLElement | null
): PositionResult {
  if (!ref) return { top, left };

  const { innerWidth, innerHeight } = window;

  const winHeight = innerHeight - 64;
  const winWidth = innerWidth - 64;

  const rect = ref.getBoundingClientRect();
  const refWidth = rect.width;
  const refHeight = rect.height;

  const positions: Record<Position, PositionResult> = {
    bottom: { top: top, left: left },
    top: { top: top - refHeight, left: left },
    right: { top: top, left: left + refWidth },
    left: { top: top, left: left - refWidth },
  };

  const fits = (pos: { top: number; left: number }): boolean => {
    return (
      pos.top >= 0 &&
      pos.left >= 0 &&
      pos.top + refHeight <= winHeight &&
      pos.left + refWidth <= winWidth
    );
  };

  for (const direction of ["bottom", "top", "right", "left"] as const) {
    const pos = positions[direction];
    if (fits(pos)) {
      return pos;
    }
  }

  return {
    top: Math.min(Math.max(top, 0), winHeight - refHeight),
    left: Math.min(Math.max(left, 0), winWidth - refWidth),
  };
}
