import { useCallback } from "react";
import { useAppSelector } from "../store/hooks";
import { canAccessContainer } from "../store/access";
import type { TContainer } from "../store/types/common.types";
import {
  selectCurrentUser,
  selectVisibleBoards,
  selectVisibleContainers,
  selectVisibleFolders,
  selectVisibleSpaces,
} from "../store/selectors/accessSelectors";

export default function useAccessControl() {
  const containers = useAppSelector(selectVisibleContainers);
  const allContainers = useAppSelector((state) => state.board.containers);
  const grants = useAppSelector((state) => state.board.grants);
  const users = useAppSelector((state) => state.board.users);
  const currentUserId = useAppSelector((state) => state.session.currentUserId);
  const currentUser = useAppSelector(selectCurrentUser);
  const visibleSpaces = useAppSelector(selectVisibleSpaces);
  const visibleFolders = useAppSelector(selectVisibleFolders);
  const visibleBoards = useAppSelector(selectVisibleBoards);
  const canManage = currentUser?.role === "admin";
  const canCreateSpace = Boolean(currentUser);
  const canAccess = useCallback(
    (container: TContainer) =>
      canAccessContainer(currentUser, container.id, allContainers, grants),
    [allContainers, currentUser, grants],
  );
  const getFirstAccessibleBoard = useCallback(
    (userId: string) => {
      const user = users.find((candidate) => candidate.id === userId);
      const accessibleSpaces = allContainers
        .filter(
          (container) =>
            container.type === "space" &&
            canAccessContainer(user, container.id, allContainers, grants),
        )
        .sort((a, b) => a.position - b.position);
      for (const space of accessibleSpaces) {
        const boards = allContainers
          .filter((container) => container.type === "list")
          .filter((board) => {
            let current = board.parentId
              ? allContainers.find((item) => item.id === board.parentId)
              : undefined;
            while (current) {
              if (current.id === space.id) return true;
              current = current.parentId
                ? allContainers.find((item) => item.id === current?.parentId)
                : undefined;
            }
            return false;
          })
          .sort((a, b) => a.position - b.position);
        if (boards[0]) return boards[0].id;
      }
      return null;
    },
    [allContainers, grants, users],
  );

  return {
    containers,
    allContainers,
    grants,
    users,
    currentUser,
    currentUserId,
    canManage,
    canCreateSpace,
    canAccess,
    visibleSpaces,
    visibleFolders,
    visibleBoards,
    getFirstAccessibleBoard,
  };
}
