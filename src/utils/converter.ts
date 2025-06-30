export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

export function clipString(input: string | null, maxLength: number): string {
  if (input === null) return "";

  if (maxLength <= 3) {
    // Not enough room for ellipsis and content
    return ".".repeat(Math.max(0, maxLength));
  }

  if (input.length <= maxLength) {
    return input;
  }

  return input.slice(0, maxLength - 3) + "...";
}
