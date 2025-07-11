export function errorToString(error: any) {
  const { code = "000", message = "Unspecified error" } = error;

  return `[${code}] ${message}`;
}

export function snakeCap(c: string) {
  return c
    .split("_")
    .map((q) => q.charAt(0).toUpperCase() + q.slice(1))
    .join(" ");
}

export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}
