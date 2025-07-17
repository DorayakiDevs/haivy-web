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

export function round(val: number, dec = 3): number {
  const factor = Math.pow(10, dec);
  return Math.round(val * factor) / factor;
}

export function roundToLocal(val: number, dec = 2) {
  return round(val, dec).toLocaleString();
}
