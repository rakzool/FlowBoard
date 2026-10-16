import { useMemo, useState } from "react";
import {
  addContainer,
  removeContainer,
  updateContainer,
} from "../store/reducer/boardReducer";
import { selectList } from "../store/reducer/sessionReducer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { TContainer } from "../store/types/common.types";

export type TBoard = TContainer;
export type TFolder = TContainer;
export type TSpace = TContainer;
export type TAddTarget = {
  type: "space" | "folder" | "board";
  parentId?: string;
};

export default function useSideBar() {
  const dispatch = useAppDispatch();
  const containers = useAppSelector((state) => state.board.containers);
  const selectedListId = useAppSelector(
    (state) => state.session.selectedListId,
  );
  const [adding, setAdding] = useState<TAddTarget | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const spaces = useMemo(
    () => containers.filter((item) => item.type === "space"),
    [containers],
  );
  const selectedBoard =
    containers.find((item) => item.id === selectedListId) ?? null;

  const create = (name: string) => {
    if (!adding) return;
    const parentId = adding.parentId ?? "workspace-flowboard";
    const type = adding.type === "board" ? "list" : adding.type;
    const position = containers.filter(
      (item) => item.parentId === parentId && item.type === type,
    ).length;
    if (!name.trim()) return;
    dispatch(
      addContainer({
        id: `${type}-${Date.now()}`,
        name,
        type,
        parentId,
        position,
        visibility: "private",
        archivedAt: null,
      }),
    );
    setAdding(null);
  };

  const edit = (id: string, name: string) => {
    if (name.trim()) dispatch(updateContainer({ id, name: name.trim() }));
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
    dispatch(removeContainer(id));
    if (selectedListId && removed.has(selectedListId))
      dispatch(selectList(null));
    setEditingId(null);
  };

  return {
    spaces,
    folders: containers.filter((item) => item.type === "folder"),
    boards: containers.filter((item) => item.type === "list"),
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
