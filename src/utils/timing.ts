export function wait(delayMs: number): Promise<void>;
export function wait(delayMs: number, callback: () => void): undefined;

export function wait(
  delayMs = 2000,
  callback?: () => void
): Promise<void> | undefined {
  if (callback) {
    setTimeout(callback, delayMs);
  }

  return new Promise((res) => setTimeout(res, delayMs));
}
