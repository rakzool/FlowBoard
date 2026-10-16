import Paper from "../DesignComponents/Paper";
import Board from "../Board/Board";
import { useAppSelector } from "../../store/hooks";
import type { TRootState } from "../../store/reducer/rootReducer";

const selectBoardState = (state: TRootState): TRootState["board"] => state.board;
const selectSelectedListId = (state: TRootState): string | null => state.session.selectedListId;

export default function Dashboard() {
  const { containers, statuses, tasks } = useAppSelector(selectBoardState);
  const selectedListId = useAppSelector(selectSelectedListId);
  const board = containers.find((item) => item.id === selectedListId && item.type === "list");
  const folder = board ? containers.find((item) => item.id === board.parentId) : undefined;
  const space = folder ? containers.find((item) => item.id === folder.parentId) : undefined;
  const boardStatuses = [...statuses]
    .filter((status) => status.listId === board?.id)
    .sort((a, b) => a.position - b.position);
  const boardTasks = tasks.filter((task) => task.primaryListId === board?.id);

  return (
    <Paper className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-brand-primary/10 px-6 py-5">
        <p className="text-xs text-text/45">{space?.name ?? "Workspace"}{folder ? ` / ${folder.name}` : ""}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{board?.name ?? "Choose a board"}</h1>
        <p className="mt-1 text-sm text-text/55">{board ? "Keep work moving across the team." : "Select a board from the sidebar to see its work."}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto p-6">
        {board ? <Board name={board.name} statuses={boardStatuses} tasks={boardTasks} /> : <div className="flex h-full items-center justify-center"><p className="rounded-xl border border-dashed border-brand-primary/15 px-8 py-6 text-sm text-text/50">Choose a board from the workspace tree.</p></div>}
      </div>
    </Paper>
  );
}
