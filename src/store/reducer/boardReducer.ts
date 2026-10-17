import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  TContainer,
  TContainerCreate,
  TContainerAccessUpdate,
  TContainerUpdate,
  TPriority,
  TStatus,
  TTask,
  TTaskCreate,
  TTaskUpdate,
  TGrant,
  TUser,
  TErrorCode,
  TBoardFeedback,
} from "../types/common.types";
import { canAccessContainer } from "../access";

export type TBoardState = {
  containers: TContainer[];
  statuses: TStatus[];
  tasks: TTask[];
  users: TUser[];
  grants: TGrant[];
  lastError: { code: TErrorCode; message: string } | null;
  lastFeedback: TBoardFeedback | null;
};

const initialState: TBoardState = {
  containers: [],
  statuses: [],
  tasks: [],
  users: [],
  grants: [],
  lastError: null,
  lastFeedback: null,
};

const setFeedback = (
  state: TBoardState,
  kind: TBoardFeedback["kind"],
  message: string,
) => {
  state.lastFeedback = {
    id: (state.lastFeedback?.id ?? 0) + 1,
    kind,
    message,
  };
};
const setError = (state: TBoardState, message: string) => {
  state.lastError = { code: "FORBIDDEN", message };
  setFeedback(state, "error", message);
};
const setValidationError = (state: TBoardState, message: string) => {
  state.lastError = { code: "VALIDATION", message };
  setFeedback(state, "error", message);
};
const setSuccess = (state: TBoardState, message: string) => {
  state.lastError = null;
  setFeedback(state, "success", message);
};
const taskTree = (state: TBoardState, rootId: string) => {
  const ids = new Set([rootId]);
  state.tasks.forEach((task) => {
    if (task.parentTaskId && ids.has(task.parentTaskId)) ids.add(task.id);
  });
  return state.tasks.filter((task) => ids.has(task.id));
};
const getUser = (state: TBoardState, userId: string | undefined) =>
  state.users.find((user) => user.id === userId);
const canMutate = (
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

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addContainer: (state, action: PayloadAction<TContainerCreate>) => {
      const {
        container,
        userIds = [],
        deniedUserIds = [],
        currentUserId,
      } = action.payload;
      const parent = container.parentId
        ? state.containers.find((item) => item.id === container.parentId)
        : null;
      const parentTypes: Partial<
        Record<TContainer["type"], TContainer["type"]>
      > = { space: "workspace", folder: "space", list: "folder" };
      const parentIsValid =
        container.type === "workspace"
          ? container.parentId === null
          : Boolean(parent && parentTypes[container.type] === parent.type);
      if (
        !container.name.trim() ||
        !parentIsValid ||
        state.containers.some((item) => item.id === container.id)
      )
        return;
      const parentIsAccessible =
        container.type === "space"
          ? true
          : Boolean(parent && canMutate(state, currentUserId, parent.id));
      if (!parentIsAccessible) {
        setError(
          state,
          "403: You do not have permission to create content here.",
        );
        return;
      }
      const user = getUser(state, currentUserId);
      const nonAdminAccessIsDefault =
        user?.role !== "admin" &&
        user &&
        userIds.every((userId) => userId === user.id) &&
        deniedUserIds.length === 0 &&
        container.visibility ===
          (container.type === "space" ? "private" : "public");
      if (user?.role !== "admin" && !nonAdminAccessIsDefault) {
        setError(
          state,
          "403: Only administrators can control container access.",
        );
        return;
      }
      setSuccess(
        state,
        `${container.type === "list" ? "Board" : container.type[0].toUpperCase() + container.type.slice(1)} created successfully.`,
      );
      state.containers.push(container);
      if (userIds.length) {
        userIds
          .filter((userId) => state.users.some((user) => user.id === userId))
          .forEach((userId) => {
            state.grants.push({
              id: `${container.id}:${userId}`,
              resourceId: container.id,
              userId,
              mode: "allow",
            });
          });
      }
      deniedUserIds
        .filter((userId) => state.users.some((user) => user.id === userId))
        .forEach((userId) => {
          state.grants.push({
            id: `${container.id}:${userId}:deny`,
            resourceId: container.id,
            userId,
            mode: "deny",
          });
        });
      if (container.type === "list") {
        state.statuses.push(...defaultStatuses(container.id));
      }
    },
    updateContainer: (state, action: PayloadAction<TContainerUpdate>) => {
      const container = state.containers.find(
        (item) => item.id === action.payload.id,
      );
      const user = getUser(state, action.payload.currentUserId);
      if (!container) return;
      if (user?.role !== "admin") {
        setError(state, "403: Only administrators can edit containers.");
        return;
      }
      setSuccess(state, "Container updated successfully.");
      if (action.payload.name !== undefined && action.payload.name.trim())
        container.name = action.payload.name.trim();
      if (action.payload.position !== undefined && action.payload.position >= 0)
        container.position = action.payload.position;
    },
    updateContainerAccess: (
      state,
      action: PayloadAction<TContainerAccessUpdate>,
    ) => {
      const resource = state.containers.find(
        (item) => item.id === action.payload.resourceId,
      );
      if (!resource) return;
      const user = getUser(state, action.payload.currentUserId);
      if (user?.role !== "admin") {
        setError(state, "403: Only administrators can change permissions.");
        return;
      }
      setSuccess(state, "Container permissions updated successfully.");
      resource.visibility = action.payload.visibility;
      state.grants = state.grants.filter(
        (grant) => grant.resourceId !== resource.id,
      );
      action.payload.deniedUserIds
        .filter((userId) => state.users.some((user) => user.id === userId))
        .forEach((userId) =>
          state.grants.push({
            id: `${resource.id}:${userId}:deny`,
            resourceId: resource.id,
            userId,
            mode: "deny",
          }),
        );
      action.payload.allowedUserIds
        .filter(
          (userId) =>
            state.users.some((user) => user.id === userId) &&
            !action.payload.deniedUserIds.includes(userId),
        )
        .forEach((userId) =>
          state.grants.push({
            id: `${resource.id}:${userId}`,
            resourceId: resource.id,
            userId,
            mode: "allow",
          }),
        );
    },
    removeContainer: (
      state,
      action: PayloadAction<{ id: string; currentUserId?: string }>,
    ) => {
      const user = getUser(state, action.payload.currentUserId);
      if (user?.role !== "admin") {
        setError(state, "403: Only administrators can delete containers.");
        return;
      }
      setSuccess(state, "Container deleted successfully.");
      const removedIds = new Set<string>([action.payload.id]);
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
      state.grants = state.grants.filter(
        (grant) => !removedIds.has(grant.resourceId),
      );
    },
    addTask: (state, action: PayloadAction<TTaskCreate>) => {
      const { task, currentUserId } = action.payload;
      if (task.parentTaskId === task.id) {
        setValidationError(state, "A task cannot be its own parent.");
        return;
      }
      if (!canMutate(state, currentUserId, task.primaryListId)) {
        setError(
          state,
          "403: You do not have permission to add tasks to this board.",
        );
        return;
      }
      if (!hasValidTaskShape(state, task)) {
        setValidationError(state, "Task details are not valid.");
        return;
      }
      setSuccess(
        state,
        `${task.parentTaskId ? "Subtask" : "Task"} created successfully.`,
      );
      state.tasks.push({
          ...task,
          title: task.title.trim(),
        });
    },
    updateTask: (state, action: PayloadAction<TTaskUpdate>) => {
      const task = state.tasks.find((item) => item.id === action.payload.id);
      if (!task) return;
      if (!canMutate(state, action.payload.currentUserId, task.primaryListId)) {
        setError(state, "403: You do not have permission to edit this task.");
        return;
      }
      const changes = action.payload.changes;
      const nextStatus = changes.statusId
        ? state.statuses.find((item) => item.id === changes.statusId)
        : undefined;
      const nextTask = { ...task, ...changes };
      if (
        (nextStatus && nextStatus.listId !== task.primaryListId) ||
        !hasValidTaskShape(state, nextTask)
      ) {
        setValidationError(state, "Task changes are not valid.");
        return;
      }
      setSuccess(state, "Task updated successfully.");
      const previousStatusId = task.statusId;
      Object.assign(task, changes, {
        title: changes.title?.trim() ?? task.title,
        description: changes.description?.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });
      if (changes.statusId && changes.statusId !== previousStatusId) {
        const parentTaskId = task.parentTaskId;
        state.tasks
          .filter(
            (item) =>
              item.statusId === previousStatusId &&
              item.parentTaskId === parentTaskId,
          )
          .sort((a, b) => a.position - b.position)
          .forEach((item, index) => {
            item.position = index;
          });
        const destination = state.tasks
          .filter(
            (item) =>
              item.statusId === changes.statusId &&
              item.parentTaskId === parentTaskId,
          )
          .sort((a, b) => a.position - b.position);
        destination.forEach((item, index) => {
          item.position = index;
        });
        task.position = destination.length;
      }
    },
    archiveTask: (
      state,
      action: PayloadAction<{ taskId: string; currentUserId?: string }>,
    ) => {
      const task = state.tasks.find(
        (item) => item.id === action.payload.taskId,
      );
      if (!task) return;
      if (!canMutate(state, action.payload.currentUserId, task.primaryListId)) {
        setError(
          state,
          "403: You do not have permission to archive this task.",
        );
        return;
      }
      setSuccess(state, "Task archived successfully.");
      const archivedAt = new Date().toISOString();
      taskTree(state, task.id).forEach((item) => {
        item.archivedAt = archivedAt;
      });
    },
    unarchiveTask: (
      state,
      action: PayloadAction<{ taskId: string; currentUserId?: string }>,
    ) => {
      const task = state.tasks.find(
        (item) => item.id === action.payload.taskId,
      );
      if (!task) return;
      if (!canMutate(state, action.payload.currentUserId, task.primaryListId)) {
        setError(
          state,
          "403: You do not have permission to restore this task.",
        );
        return;
      }
      setSuccess(state, "Task restored successfully.");
      const root = task.parentTaskId
        ? (state.tasks.find((item) => item.id === task.parentTaskId) ?? task)
        : task;
      const todo = state.statuses
        .filter(
          (item) =>
            item.listId === task.primaryListId && item.category === "todo",
        )
        .sort((a, b) => a.position - b.position)[0];
      if (!todo) return;
      const restored = taskTree(state, root.id);
      restored.forEach((item) => {
        item.archivedAt = null;
        item.statusId = todo.id;
      });
      const siblings = state.tasks
        .filter(
          (item) =>
            item.statusId === todo.id &&
            item.parentTaskId === null &&
            item.id !== root.id &&
            item.archivedAt === null,
        )
        .sort((a, b) => a.position - b.position);
      siblings.forEach((item, index) => {
        item.position = index;
      });
      root.position = siblings.length;
      restored
        .filter((item) => item.parentTaskId === root.id)
        .forEach((item, index) => {
          item.position = index;
        });
    },
    moveTask: (
      state,
      action: PayloadAction<{
        taskId: string;
        statusId: string;
        position: number;
        currentUserId?: string;
      }>,
    ) => {
      const task = state.tasks.find(
        (item) => item.id === action.payload.taskId,
      );
      const nextStatus = state.statuses.find(
        (status) => status.id === action.payload.statusId,
      );
      if (
        task &&
        !canMutate(state, action.payload.currentUserId, task.primaryListId)
      ) {
        setError(
          state,
          "403: You do not have permission to move tasks on this board.",
        );
        return;
      }
      if (
        !task ||
        !nextStatus ||
        nextStatus.listId !== task.primaryListId ||
        action.payload.position < 0
      )
        return;
      const sourceStatusId = task.statusId;
      const sourceTasks = state.tasks
        .filter((item) => item.statusId === sourceStatusId)
        .sort((a, b) => a.position - b.position);
      const targetTasks = state.tasks
        .filter(
          (item) => item.statusId === nextStatus.id && item.id !== task.id,
        )
        .sort((a, b) => a.position - b.position);
      const sourceIndex = sourceTasks.findIndex((item) => item.id === task.id);
      const insertAt =
        sourceStatusId === nextStatus.id &&
        sourceIndex < action.payload.position
          ? action.payload.position - 1
          : action.payload.position;
      const destination =
        sourceStatusId === nextStatus.id
          ? sourceTasks.filter((item) => item.id !== task.id)
          : targetTasks;
      destination.splice(Math.min(insertAt, destination.length), 0, task);
      if (sourceStatusId !== nextStatus.id) {
        sourceTasks
          .filter((item) => item.id !== task.id)
          .forEach((item, index) => {
            item.position = index;
          });
      }
      destination.forEach((item, index) => {
        item.statusId = nextStatus.id;
        item.position = index;
      });
      task.updatedAt = new Date().toISOString();
      setSuccess(state, "Task moved successfully.");
    },
    reportBoardError: (
      state,
      action: PayloadAction<{ code: TErrorCode; message: string }>,
    ) => {
      state.lastError = action.payload;
      setFeedback(state, "error", action.payload.message);
    },
    clearBoardError: (state) => {
      state.lastError = null;
    },
  },
});

export const {
  addContainer,
  updateContainer,
  updateContainerAccess,
  removeContainer,
  addTask,
  updateTask,
  archiveTask,
  unarchiveTask,
  moveTask,
  reportBoardError,
  clearBoardError,
} = boardSlice.actions;
export default boardSlice.reducer;
