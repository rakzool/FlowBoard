import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  TContainer,
  TContainerUpdate,
  TPriority,
  TStatus,
  TTask,
} from "../types/common.types";

export type TBoardState = {
  containers: TContainer[];
  statuses: TStatus[];
  tasks: TTask[];
};

const initialState: TBoardState = { containers: [], statuses: [], tasks: [] };

const defaultStatuses = (listId: string): TStatus[] => [
  {
    id: `${listId}-todo`,
    listId,
    name: "ToDo",
    category: "todo",
    color: "brand-secondary",
    position: 0,
  },
  {
    id: `${listId}-in-progress`,
    listId,
    name: "In-progress",
    category: "active",
    color: "brand-primary",
    position: 1,
  },
  {
    id: `${listId}-done`,
    listId,
    name: "Done",
    category: "done",
    color: "emerald-500",
    position: 2,
  },
];
const priorities: TPriority[] = ["urgent", "high", "normal", "low", "none"];
const isIsoDate = (value: string) =>
  !Number.isNaN(Date.parse(value)) && value.includes("T");
const hasValidTaskShape = (state: TBoardState, task: TTask) => {
  const list = state.containers.find(
    (item) => item.id === task.primaryListId && item.type === "list",
  );
  const status = state.statuses.find((item) => item.id === task.statusId);
  return Boolean(
    list &&
    status &&
    status.listId === list.id &&
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

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addContainer: (state, action: PayloadAction<TContainer>) => {
      const parent = action.payload.parentId
        ? state.containers.find((item) => item.id === action.payload.parentId)
        : null;
      const parentTypes: Partial<
        Record<TContainer["type"], TContainer["type"]>
      > = { space: "workspace", folder: "space", list: "folder" };
      const parentIsValid =
        action.payload.type === "workspace"
          ? action.payload.parentId === null
          : Boolean(parent && parentTypes[action.payload.type] === parent.type);
      if (
        !action.payload.name.trim() ||
        !parentIsValid ||
        state.containers.some((item) => item.id === action.payload.id)
      )
        return;
      state.containers.push(action.payload);
      if (action.payload.type === "list") {
        state.statuses.push(...defaultStatuses(action.payload.id));
      }
    },
    updateContainer: (state, action: PayloadAction<TContainerUpdate>) => {
      const container = state.containers.find(
        (item) => item.id === action.payload.id,
      );
      if (!container) return;
      if (action.payload.name !== undefined && action.payload.name.trim())
        container.name = action.payload.name.trim();
      if (action.payload.position !== undefined && action.payload.position >= 0)
        container.position = action.payload.position;
    },
    removeContainer: (state, action: PayloadAction<string>) => {
      const removedIds = new Set<string>([action.payload]);
      let changed = true;
      while (changed) {
        changed = false;
        state.containers.forEach((container) => {
          if (
            container.parentId &&
            removedIds.has(container.parentId) &&
            !removedIds.has(container.id)
          ) {
            removedIds.add(container.id);
            changed = true;
          }
        });
      }
      const removedLists = new Set(
        state.containers
          .filter(
            (container) =>
              removedIds.has(container.id) && container.type === "list",
          )
          .map((container) => container.id),
      );
      state.containers = state.containers.filter(
        (container) => !removedIds.has(container.id),
      );
      state.statuses = state.statuses.filter(
        (status) => !removedLists.has(status.listId),
      );
      state.tasks = state.tasks.filter(
        (task) => !removedLists.has(task.primaryListId),
      );
    },
    addTask: (state, action: PayloadAction<TTask>) => {
      if (hasValidTaskShape(state, action.payload))
        state.tasks.push({
          ...action.payload,
          title: action.payload.title.trim(),
        });
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; statusId: string; position: number }>) => {
      const task = state.tasks.find(
        (item) => item.id === action.payload.taskId,
      );
      const nextStatus = state.statuses.find(
        (status) => status.id === action.payload.statusId,
      );
      if (
        !task ||
        !nextStatus ||
        nextStatus.listId !== task.primaryListId ||
        action.payload.position < 0
      )
        return;
      const sourceStatusId = task.statusId;
      const sourceTasks = state.tasks.filter((item) => item.statusId === sourceStatusId).sort((a, b) => a.position - b.position);
      const targetTasks = state.tasks.filter((item) => item.statusId === nextStatus.id && item.id !== task.id).sort((a, b) => a.position - b.position);
      const sourceIndex = sourceTasks.findIndex((item) => item.id === task.id);
      const insertAt = sourceStatusId === nextStatus.id && sourceIndex < action.payload.position ? action.payload.position - 1 : action.payload.position;
      const destination = sourceStatusId === nextStatus.id ? sourceTasks.filter((item) => item.id !== task.id) : targetTasks;
      destination.splice(Math.min(insertAt, destination.length), 0, task);
      if (sourceStatusId !== nextStatus.id) {
        sourceTasks.filter((item) => item.id !== task.id).forEach((item, index) => { item.position = index; });
      }
      destination.forEach((item, index) => { item.statusId = nextStatus.id; item.position = index; });
      task.updatedAt = new Date().toISOString();
    },
  },
});

export const {
  addContainer,
  updateContainer,
  removeContainer,
  addTask,
  moveTask,
} = boardSlice.actions;
export default boardSlice.reducer;
