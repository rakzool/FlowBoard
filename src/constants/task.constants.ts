import type { TPriority } from "../store/types/common.types";

export const TASK_PRIORITIES: TPriority[] = [
  "urgent",
  "high",
  "normal",
  "low",
  "none",
];

export const TASK_PRIORITY_OPTIONS = TASK_PRIORITIES.map((value) => ({
  value,
  label: value,
}));
