export const formatShortDueDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(new Date(value))
    : "No due date";

export const formatLongDueDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
        new Date(value),
      )
    : "No due date";

export const toDateInputValue = (value: string | null) =>
  value ? value.slice(0, 10) : "";

export const getUserInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
