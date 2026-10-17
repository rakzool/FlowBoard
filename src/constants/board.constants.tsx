export const STATUS_CATEGORY_CLASSES = {
  todo: "bg-brand-secondary",
  done: "bg-emerald-500",
  active: "bg-brand-primary",
} as const;

export const TASK_PRIORITY_TEXT_CLASSES = {
  urgent: "text-red-500",
  high: "text-orange-500",
  normal: "text-brand-primary",
  low: "text-text/50",
  none: "text-text/40",
} as const;

export const BOARD_LIST_SORT_OPTIONS = ["dueDate", "priority"] as const;
