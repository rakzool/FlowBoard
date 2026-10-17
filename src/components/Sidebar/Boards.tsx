import type { TBoard } from "../../hooks/useSideBar";
import Button from "../DesignComponents/Button";
import ContainerActions from "./ContainerActions";

type TBoardsProps = {
  boards: TBoard[];
  onSelect: (board: TBoard) => void;
  startEditing: (id: string) => void;
  remove: (id: string) => void;
  canManage: boolean;
};
const boardIcon = "▦";

export default function Boards({
  boards,
  onSelect,
  startEditing,
  remove,
  canManage,
}: TBoardsProps) {
  return (
    <div className="ml-9 space-y-0.5 border-l border-border pl-2">
      {boards.map((board) => (
        <div key={board.id}>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onSelect(board)}
              className="flex min-w-0 flex-1 items-center gap-1.5 rounded-control px-2 py-1 text-left text-xs font-normal"
            >
              <span aria-hidden="true" className="text-text/50">
                {boardIcon}
              </span>
              <span className="truncate">{board.name}</span>
            </Button>
            {canManage && <ContainerActions
              name={board.name}
              onEdit={() => startEditing(board.id)}
              onDelete={() => {
                if (window.confirm(`Delete ${board.name}?`)) remove(board.id);
              }}
            />}
          </div>
        </div>
      ))}
    </div>
  );
}
