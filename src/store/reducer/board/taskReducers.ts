import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import type { TTaskCreate, TTaskUpdate } from "../../types/common.types";
import type { TBoardState, TMoveTaskPayload } from "./boardTypes";
import { canMutate, hasValidTaskShape, setError, setSuccess, setValidationError, taskTree } from "./boardUtils";

type TTaskMutationPayload = { taskId: string; currentUserId?: string };

export const taskReducers = {
  addTask: ((state, action: PayloadAction<TTaskCreate>) => {
    const { task, currentUserId } = action.payload;
    if (task.parentTaskId === task.id) {
      setValidationError(state, "A task cannot be its own parent.");
      return;
    }
    if (!canMutate(state, currentUserId, task.primaryListId)) {
      setError(state, "403: You do not have permission to add tasks to this board.");
      return;
    }
    if (!hasValidTaskShape(state, task)) {
      setValidationError(state, "Task details are not valid.");
      return;
    }
    setSuccess(state, `${task.parentTaskId ? "Subtask" : "Task"} created successfully.`);
    state.tasks.push({ ...task, title: task.title.trim() });
  }) as CaseReducer<TBoardState, PayloadAction<TTaskCreate>>,

  updateTask: ((state, action: PayloadAction<TTaskUpdate>) => {
    const task = state.tasks.find((item) => item.id === action.payload.id);
    if (!task) return;
    if (!canMutate(state, action.payload.currentUserId, task.primaryListId)) {
      setError(state, "403: You do not have permission to edit this task.");
      return;
    }
    const changes = action.payload.changes;
    const nextStatus = changes.statusId ? state.statuses.find((item) => item.id === changes.statusId) : undefined;
    const nextTask = { ...task, ...changes };
    if ((nextStatus && nextStatus.listId !== task.primaryListId) || !hasValidTaskShape(state, nextTask)) {
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
        .filter((item) => item.statusId === previousStatusId && item.parentTaskId === parentTaskId)
        .sort((a, b) => a.position - b.position)
        .forEach((item, index) => { item.position = index; });
      const destination = state.tasks
        .filter((item) => item.statusId === changes.statusId && item.parentTaskId === parentTaskId)
        .sort((a, b) => a.position - b.position);
      destination.forEach((item, index) => { item.position = index; });
      task.position = destination.length;
    }
  }) as CaseReducer<TBoardState, PayloadAction<TTaskUpdate>>,

  archiveTask: ((state, action: PayloadAction<TTaskMutationPayload>) => {
    const task = state.tasks.find((item) => item.id === action.payload.taskId);
    if (!task) return;
    if (!canMutate(state, action.payload.currentUserId, task.primaryListId)) {
      setError(state, "403: You do not have permission to archive this task.");
      return;
    }
    setSuccess(state, "Task archived successfully.");
    const archivedAt = new Date().toISOString();
    taskTree(state, task.id).forEach((item) => { item.archivedAt = archivedAt; });
  }) as CaseReducer<TBoardState, PayloadAction<TTaskMutationPayload>>,

  unarchiveTask: ((state, action: PayloadAction<TTaskMutationPayload>) => {
    const task = state.tasks.find((item) => item.id === action.payload.taskId);
    if (!task) return;
    if (!canMutate(state, action.payload.currentUserId, task.primaryListId)) {
      setError(state, "403: You do not have permission to restore this task.");
      return;
    }
    setSuccess(state, "Task restored successfully.");
    const root = task.parentTaskId ? (state.tasks.find((item) => item.id === task.parentTaskId) ?? task) : task;
    const todo = state.statuses
      .filter((item) => item.listId === task.primaryListId && item.category === "todo")
      .sort((a, b) => a.position - b.position)[0];
    if (!todo) return;
    const restored = taskTree(state, root.id);
    restored.forEach((item) => { item.archivedAt = null; item.statusId = todo.id; });
    const siblings = state.tasks
      .filter((item) => item.statusId === todo.id && item.parentTaskId === null && item.id !== root.id && item.archivedAt === null)
      .sort((a, b) => a.position - b.position);
    siblings.forEach((item, index) => { item.position = index; });
    root.position = siblings.length;
    restored.filter((item) => item.parentTaskId === root.id).forEach((item, index) => { item.position = index; });
  }) as CaseReducer<TBoardState, PayloadAction<TTaskMutationPayload>>,

  moveTask: ((state, action: PayloadAction<TMoveTaskPayload>) => {
    const task = state.tasks.find((item) => item.id === action.payload.taskId);
    const nextStatus = state.statuses.find((status) => status.id === action.payload.statusId);
    if (task && !canMutate(state, action.payload.currentUserId, task.primaryListId)) {
      setError(state, "403: You do not have permission to move tasks on this board.");
      return;
    }
    if (!task || !nextStatus || nextStatus.listId !== task.primaryListId || action.payload.position < 0) return;
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
  }) as CaseReducer<TBoardState, PayloadAction<TMoveTaskPayload>>,
};
