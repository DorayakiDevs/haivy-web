export function merge(a?: string, ...b: (string | undefined)[]) {
  a = a ?? "";

  const c = b?.map((q) => q ?? "").join(" ") ?? "";
  return [a.trim(), c.trim()].join(" ").trim();
}
