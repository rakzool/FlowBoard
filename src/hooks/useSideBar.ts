import { useState } from "react";
import {
  addContainer,
  removeContainer,
  updateContainerAccess,
  updateContainer,
} from "../store/reducer/boardReducer";
import { selectList } from "../store/reducer/sessionReducer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type {
  TContainer,
  TContainerAccessDetails,
  TGrantMode,
} from "../store/types/common.types";
import useAccessControl from "./useAccessControl";

export type TBoard = TContainer;
export type TFolder = TContainer;
export type TSpace = TContainer;
export type TAddTarget = {
  type: "space" | "folder" | "board";
  parentId?: string;
};

export default function useSideBar() {
  const dispatch = useAppDispatch();
  const {
    containers,
    grants,
    users,
    currentUserId,
    canManage,
    canCreateSpace,
    canAccess,
  } = useAccessControl();
  const selectedListId = useAppSelector(
    (state) => state.session.selectedListId,
  );
  const lastError = useAppSelector((state) => state.board.lastError);
  const [adding, setAdding] = useState<TAddTarget | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const spaces = containers.filter(
    (item) => item.type === "space" && canAccess(item),
  );
  const selectedBoard =
    containers.find((item) => item.id === selectedListId && canAccess(item)) ??
    null;

  const create = (name: string, accessDetails?: TContainerAccessDetails) => {
    if (!adding || !canCreateSpace) return;
    const parentId = adding.parentId ?? "workspace-flowboard";
    const type = adding.type === "board" ? "list" : adding.type;
    if (type !== "space") {
      const parent = containers.find((item) => item.id === parentId);
      if (!parent || !canAccess(parent)) return;
    }
    const position = containers.filter(
      (item) => item.parentId === parentId && item.type === type,
    ).length;
    if (!name.trim()) return;
    const permittedUsers = [
      ...new Set([currentUserId, ...(accessDetails?.allowedUserIds ?? [])]),
    ];
    const deniedUsers = (accessDetails?.deniedUserIds ?? []).filter(
      (userId) => userId !== currentUserId,
    );
    dispatch(
      addContainer({
        container: {
          id: `${type}-${Date.now()}`,
          name,
          type,
          parentId,
          position,
          visibility:
            accessDetails?.visibility ??
            (type === "space" ? "private" : "public"),
          archivedAt: null,
        },
        userIds: permittedUsers,
        deniedUserIds: deniedUsers,
        currentUserId,
      }),
    );
    setAdding(null);
  };

  const edit = (
    id: string,
    name: string,
    accessDetails?: TContainerAccessDetails,
  ) => {
    if (canManage && name.trim()) {
      dispatch(updateContainer({ id, name: name.trim(), currentUserId }));
      if (accessDetails)
        dispatch(
          updateContainerAccess({
            resourceId: id,
            ...accessDetails,
            currentUserId,
          }),
        );
    }
    setEditingId(null);
  };
  const remove = (id: string) => {
    const removed = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      containers.forEach((container) => {
        if (
          container.parentId &&
          removed.has(container.parentId) &&
          !removed.has(container.id)
        ) {
          removed.add(container.id);
          changed = true;
        }
      });
    }
    if (canManage) dispatch(removeContainer({ id, currentUserId }));
    if (selectedListId && removed.has(selectedListId))
      dispatch(selectList(null));
    setEditingId(null);
  };

  return {
    spaces,
    folders: containers.filter(
      (item) => item.type === "folder" && canAccess(item),
    ),
    boards: containers.filter(
      (item) => item.type === "list" && canAccess(item),
    ),
    users,
    getAccessUserIds: (resourceId: string, mode: TGrantMode) =>
      grants
        .filter(
          (grant) => grant.resourceId === resourceId && grant.mode === mode,
        )
        .map((grant) => grant.userId),
    canManage,
    canCreateSpace,
    canCreateInSpace: (space: TSpace) => canAccess(space),
    lastError,
    adding,
    editingId,
    selectedBoard,
    create,
    startAdding: setAdding,
    cancelAdding: () => setAdding(null),
    startEditing: setEditingId,
    cancelEditing: () => setEditingId(null),
    edit,
    remove,
    selectBoard: (board: TBoard) => dispatch(selectList(board.id)),
  };
}
