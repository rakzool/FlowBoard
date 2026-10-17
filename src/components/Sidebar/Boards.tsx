import type { TBoard } from "../../hooks/useSideBar";
import Button from "../DesignComponents/Button";
import ContainerActions from "./ContainerActions";
import useAccessControl from "../../hooks/useAccessControl";
import { SIDEBAR_ICONS } from "../../constants/sidebar.constants";

type TBoardsProps = {
  boards: TBoard[];
  onSelect: (board: TBoard) => void;
  startEditing: (id: string) => void;
  remove: (id: string) => void;
};
export default function Boards({
  boards,
  onSelect,
  startEditing,
  remove,
}: TBoardsProps) {
  const { canManageContainers } = useAccessControl();
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
                {SIDEBAR_ICONS.board}
              </span>
              <span className="truncate">{board.name}</span>
            </Button>
            {canManageContainers && (
              <ContainerActions
                name={board.name}
                onEdit={() => startEditing(board.id)}
                onDelete={() => {
                  if (window.confirm(`Delete ${board.name}?`)) remove(board.id);
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
