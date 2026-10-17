import type { TRootState } from "../reducer/rootReducer";
import { canAccessContainer } from "../access";
import type { TContainer } from "../types/common.types";

export const selectCurrentUser = (state: TRootState) =>
  state.board.users.find((user) => user.id === state.session.currentUserId);
export const selectCanAccessContainer = (
  state: TRootState,
  containerId: string,
) =>
  canAccessContainer(
    selectCurrentUser(state),
    containerId,
    state.board.containers,
    state.board.grants,
  );
export const selectVisibleContainers = (state: TRootState): TContainer[] => {
  const user = selectCurrentUser(state);
  return state.board.containers.filter((container) =>
    canAccessContainer(
      user,
      container.id,
      state.board.containers,
      state.board.grants,
    ),
  );
};
export const selectVisibleSpaces = (state: TRootState) =>
  selectVisibleContainers(state).filter(
    (container) => container.type === "space",
  );
export const selectVisibleFolders = (state: TRootState) =>
  selectVisibleContainers(state).filter(
    (container) => container.type === "folder",
  );
export const selectVisibleBoards = (state: TRootState) =>
  selectVisibleContainers(state).filter(
    (container) => container.type === "list",
  );
