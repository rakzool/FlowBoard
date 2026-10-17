import type { TPriority, TStatus, TTask } from "../../types/common.types";
import { canAccessContainer } from "../../access";
import type { TBoardState } from "./boardTypes";

export const setFeedback = (
  state: TBoardState,
  kind: "success" | "error",
  message: string,
) => {
  state.lastFeedback = { id: (state.lastFeedback?.id ?? 0) + 1, kind, message };
};
export const setError = (state: TBoardState, message: string) => {
  state.lastError = { code: "FORBIDDEN", message };
  setFeedback(state, "error", message);
};
export const setValidationError = (state: TBoardState, message: string) => {
  state.lastError = { code: "VALIDATION", message };
  setFeedback(state, "error", message);
};
export const setSuccess = (state: TBoardState, message: string) => {
  state.lastError = null;
  setFeedback(state, "success", message);
};
export const getUser = (state: TBoardState, userId: string | undefined) =>
  state.users.find((user) => user.id === userId);
export const canMutate = (
  state: TBoardState,
  userId: string | undefined,
  resourceId: string,
) =>
  canAccessContainer(
    getUser(state, userId),
    resourceId,
    state.containers,
    state.grants,
  );
export const taskTree = (state: TBoardState, rootId: string) => {
  const ids = new Set([rootId]);
  state.tasks.forEach((task) => {
    if (task.parentTaskId && ids.has(task.parentTaskId)) ids.add(task.id);
  });
  return state.tasks.filter((task) => ids.has(task.id));
};
export const defaultStatuses = (listId: string): TStatus[] => [
  { id: `${listId}-todo`, listId, name: "ToDo", category: "todo", color: "brand-secondary", position: 0 },
  { id: `${listId}-in-progress`, listId, name: "In-progress", category: "active", color: "brand-primary", position: 1 },
  { id: `${listId}-done`, listId, name: "Done", category: "done", color: "emerald-500", position: 2 },
];
const priorities: TPriority[] = ["urgent", "high", "normal", "low", "none"];
const isIsoDate = (value: string) =>
  !Number.isNaN(Date.parse(value)) && value.includes("T");
export const hasValidTaskShape = (state: TBoardState, task: TTask) => {
  const list = state.containers.find(
    (item) => item.id === task.primaryListId && item.type === "list",
  );
  const status = state.statuses.find((item) => item.id === task.statusId);
  const parentTask = task.parentTaskId
    ? state.tasks.find((item) => item.id === task.parentTaskId)
    : undefined;
  return Boolean(
    list &&
      status &&
      status.listId === list.id &&
      (!task.parentTaskId ||
        Boolean(
          parentTask &&
            parentTask.parentTaskId === null &&
            parentTask.primaryListId === task.primaryListId,
        )) &&
      task.title.trim() &&
      task.title.length <= 500 &&
      priorities.includes(task.priority) &&
      Array.isArray(task.assigneeIds) &&
      task.position >= 0 &&
      isIsoDate(task.createdAt) &&
      isIsoDate(task.updatedAt) &&
      (!task.dueDate || isIsoDate(task.dueDate)),
  );
};
