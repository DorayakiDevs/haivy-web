export function errorToString(error: any) {
  const { code = "000", message = "Unspecified error" } = error;

  return `[${code}] ${message}`;
}
