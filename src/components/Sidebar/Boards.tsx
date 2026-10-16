import type { TBoard } from "../../hooks/useSideBar";
import Button from "../DesignComponents/Button";
import ContainerActions from "./ContainerActions";
import withSuspense from "../../utils/withSuspense";
const EditItemForm = withSuspense(() => import("./EditItemForm"));

type TBoardsProps = {
  boards: TBoard[];
  onSelect: (board: TBoard) => void;
  editingId: string | null;
  startEditing: (id: string) => void;
  cancelEditing: () => void;
  edit: (id: string, name: string) => void;
  remove: (id: string) => void;
};
const boardIcon = "▦";

export default function Boards({
  boards,
  onSelect,
  editingId,
  startEditing,
  cancelEditing,
  edit,
  remove,
}: TBoardsProps) {
  return (
    <div className="ml-10 space-y-0.5 border-l border-brand-primary/10 pl-2">
      {boards.map((board) => (
        <div key={board.id}>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onSelect(board)}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-normal"
            >
              <span aria-hidden="true" className="text-text/50">
                {boardIcon}
              </span>
              <span className="truncate">{board.name}</span>
            </Button>
            <ContainerActions
              name={board.name}
              onEdit={() => startEditing(board.id)}
              onDelete={() => {
                if (window.confirm(`Delete ${board.name}?`)) remove(board.id);
              }}
            />
          </div>
          {editingId === board.id && (
            <EditItemForm
              key={editingId}
              value={board.name}
              onSubmit={(name) => edit(board.id, name)}
              onCancel={cancelEditing}
            />
          )}
        </div>
      ))}
    </div>
  );
}
