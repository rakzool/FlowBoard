import type { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import type {
  TContainer,
  TContainerAccessUpdate,
  TContainerCreate,
  TContainerUpdate,
} from "../../types/common.types";
import type { TBoardState, TRemoveContainerPayload } from "./boardTypes";
import { canMutate, defaultStatuses, getUser, setError, setSuccess } from "./boardUtils";

export const containerReducers = {
  addContainer: ((state, action: PayloadAction<TContainerCreate>) => {
    const { container, userIds = [], deniedUserIds = [], currentUserId } = action.payload;
    const parent = container.parentId
      ? state.containers.find((item) => item.id === container.parentId)
      : null;
    const parentTypes: Partial<Record<TContainer["type"], TContainer["type"]>> = {
      space: "workspace",
      folder: "space",
      list: "folder",
    };
    const parentIsValid =
      container.type === "workspace"
        ? container.parentId === null
        : Boolean(parent && parentTypes[container.type] === parent.type);
    if (!container.name.trim() || !parentIsValid || state.containers.some((item) => item.id === container.id)) return;
    const parentIsAccessible =
      container.type === "space"
        ? true
        : Boolean(parent && canMutate(state, currentUserId, parent.id));
    if (!parentIsAccessible) {
      setError(state, "403: You do not have permission to create content here.");
      return;
    }
    const user = getUser(state, currentUserId);
    const nonAdminAccessIsDefault =
      user?.role !== "admin" &&
      user &&
      userIds.every((userId) => userId === user.id) &&
      deniedUserIds.length === 0 &&
      container.visibility === (container.type === "space" ? "private" : "public");
    if (user?.role !== "admin" && !nonAdminAccessIsDefault) {
      setError(state, "403: Only administrators can control container access.");
      return;
    }
    setSuccess(
      state,
      `${container.type === "list" ? "Board" : container.type[0].toUpperCase() + container.type.slice(1)} created successfully.`,
    );
    state.containers.push(container);
    userIds
      .filter((userId) => state.users.some((item) => item.id === userId))
      .forEach((userId) => {
        state.grants.push({ id: `${container.id}:${userId}`, resourceId: container.id, userId, mode: "allow" });
      });
    deniedUserIds
      .filter((userId) => state.users.some((item) => item.id === userId))
      .forEach((userId) => {
        state.grants.push({ id: `${container.id}:${userId}:deny`, resourceId: container.id, userId, mode: "deny" });
      });
    if (container.type === "list") state.statuses.push(...defaultStatuses(container.id));
  }) as CaseReducer<TBoardState, PayloadAction<TContainerCreate>>,

  updateContainer: ((state, action: PayloadAction<TContainerUpdate>) => {
    const container = state.containers.find((item) => item.id === action.payload.id);
    const user = getUser(state, action.payload.currentUserId);
    if (!container) return;
    if (user?.role !== "admin") {
      setError(state, "403: Only administrators can edit containers.");
      return;
    }
    setSuccess(state, "Container updated successfully.");
    if (action.payload.name !== undefined && action.payload.name.trim()) container.name = action.payload.name.trim();
    if (action.payload.position !== undefined && action.payload.position >= 0) container.position = action.payload.position;
  }) as CaseReducer<TBoardState, PayloadAction<TContainerUpdate>>,

  updateContainerAccess: ((state, action: PayloadAction<TContainerAccessUpdate>) => {
    const resource = state.containers.find((item) => item.id === action.payload.resourceId);
    if (!resource) return;
    const user = getUser(state, action.payload.currentUserId);
    if (user?.role !== "admin") {
      setError(state, "403: Only administrators can change permissions.");
      return;
    }
    setSuccess(state, "Container permissions updated successfully.");
    resource.visibility = action.payload.visibility;
    state.grants = state.grants.filter((grant) => grant.resourceId !== resource.id);
    action.payload.deniedUserIds
      .filter((userId) => state.users.some((item) => item.id === userId))
      .forEach((userId) => {
        state.grants.push({ id: `${resource.id}:${userId}:deny`, resourceId: resource.id, userId, mode: "deny" });
      });
    action.payload.allowedUserIds
      .filter((userId) => state.users.some((item) => item.id === userId) && !action.payload.deniedUserIds.includes(userId))
      .forEach((userId) => {
        state.grants.push({ id: `${resource.id}:${userId}`, resourceId: resource.id, userId, mode: "allow" });
      });
  }) as CaseReducer<TBoardState, PayloadAction<TContainerAccessUpdate>>,

  removeContainer: ((state, action: PayloadAction<TRemoveContainerPayload>) => {
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
        if (container.parentId && removedIds.has(container.parentId) && !removedIds.has(container.id)) {
          removedIds.add(container.id);
          changed = true;
        }
      });
    }
    const removedLists = new Set(
      state.containers
        .filter((container) => removedIds.has(container.id) && container.type === "list")
        .map((container) => container.id),
    );
    state.containers = state.containers.filter((container) => !removedIds.has(container.id));
    state.statuses = state.statuses.filter((status) => !removedLists.has(status.listId));
    state.tasks = state.tasks.filter((task) => !removedLists.has(task.primaryListId));
    state.grants = state.grants.filter((grant) => !removedIds.has(grant.resourceId));
  }) as CaseReducer<TBoardState, PayloadAction<TRemoveContainerPayload>>,
};
