export function formatDate(dateString: string | null) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}
