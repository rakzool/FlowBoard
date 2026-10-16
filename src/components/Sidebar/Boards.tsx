import type { TBoard } from "../../hooks/useSideBar";
import Button from "../DesignComponents/Button";

type TBoardsProps = { boards: TBoard[]; onSelect: (board: TBoard) => void };
const boardIcon = "▦";

export default function Boards({ boards, onSelect }: TBoardsProps) {
  return (
    <div className="ml-10 space-y-0.5 border-l border-brand-primary/10 pl-2">
      {boards.map((board) => (
        <Button
          key={board.id}
          type="button"
          variant="ghost"
          onClick={() => onSelect(board)}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-normal"
        >
          <span aria-hidden="true" className="text-text/50">
            {boardIcon}
          </span>
          <span className="truncate">{board.name}</span>
        </Button>
      ))}
    </div>
  );
}
