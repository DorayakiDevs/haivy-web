import { templateName } from "./data";

export function getRandomName() {
  return (
    templateName[Math.round(templateName.length * Math.random())] ||
    "James Watterson"
  );
}

export function repeat<T>(p: T, n: number): T[] {
  if (n < 0) {
    throw new RangeError("repeat count must be non-negative");
  }
  return Array.from({ length: n }, () => p);
}
