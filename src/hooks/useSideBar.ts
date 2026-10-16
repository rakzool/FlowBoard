import { useMemo, useState } from "react";
import { addContainer } from "../store/reducer/boardReducer";
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

  return {
    spaces,
    folders: containers.filter((item) => item.type === "folder"),
    boards: containers.filter((item) => item.type === "list"),
    adding,
    selectedBoard,
    create,
    startAdding: setAdding,
    cancelAdding: () => setAdding(null),
    selectBoard: (board: TBoard) => dispatch(selectList(board.id)),
  };
}
