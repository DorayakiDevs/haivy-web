import { templateName } from "./data";

export class Generator {
  static repeat<T>(p: T, n: number): T[] {
    if (n < 0) {
      throw new RangeError("repeat count must be non-negative");
    }
    return Array.from({ length: n }, () => p);
  }

  static getRandomName() {
    return (
      templateName[Math.round(templateName.length * Math.random())] ||
      "James Watterson"
    );
  }
}
