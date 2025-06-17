export function getTextFromBrackets(str: string) {
  const reg = /\(([^)]+)\)/g;

  const text = str.match(reg)?.toString() ?? "";

  return text.slice(1, text.length - 1);
}
