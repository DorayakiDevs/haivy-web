export function formatDate(isoDateString?: string | null): string {
  const date = isoDateString ? new Date(isoDateString) : new Date();

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string provided");
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}