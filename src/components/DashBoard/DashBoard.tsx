import { useState } from "react";
import Paper from "../DesignComponents/Paper";
import BoardViewTabs, { type TBoardView } from "../Board/BoardViewTabs";
import { useAppSelector } from "../../store/hooks";
import type { TRootState } from "../../store/reducer/rootReducer";
import withSuspense from "../../utils/withSuspense";
import type { TStatus } from "../../store/types/common.types";
import useAccessControl from "../../hooks/useAccessControl";
import TaskDetailModal from "../Board/TaskDetailModal";
import type { TTask } from "../../store/types/common.types";

const selectBoardState = (state: TRootState): TRootState["board"] =>
  state.board;
const selectSelectedListId = (state: TRootState): string | null =>
  state.session.selectedListId;
const Board = withSuspense(() => import("../Board/Board"));
const BoardList = withSuspense(() => import("../Board/BoardList"));
const TaskCreateModal = withSuspense(() => import("../Board/TaskCreateModal"));

export default function Dashboard() {
  const [view, setView] = useState<TBoardView>("board");
  const [newTaskStatusId, setNewTaskStatusId] = useState<string | null>(null);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const { containers, statuses, tasks, users } = useAppSelector(selectBoardState);
  const selectedListId = useAppSelector(selectSelectedListId);
  const currentUserId = useAppSelector((state) => state.session.currentUserId);
  const { canAccess } = useAccessControl();
  const boardError = useAppSelector((state) => state.board.lastError);
  const board = containers.find(
    (item) =>
      item.id === selectedListId && item.type === "list" && canAccess(item),
  );
  const selectedContainer = containers.find(
    (item) => item.id === selectedListId,
  );
  const boardAccessDenied = Boolean(
    selectedContainer && !canAccess(selectedContainer),
  );
  const folder = board
    ? containers.find((item) => item.id === board.parentId)
    : undefined;
  const space = folder
    ? containers.find((item) => item.id === folder.parentId)
    : undefined;
  const boardStatuses = [...statuses]
    .filter((status) => status.listId === board?.id)
    .sort((a, b) => a.position - b.position);
  const boardTasks = tasks.filter((task) => task.primaryListId === board?.id);
  const newTaskStatus: TStatus | null =
    boardStatuses.find((status) => status.id === newTaskStatusId) ?? null;
  const detailTask: TTask | null = tasks.find((task) => task.id === detailTaskId) ?? null;

  return (
    <Paper className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-brand-primary/10 px-6 py-5">
        {boardError && (
          <p
            role="alert"
            className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600"
          >
            {boardError.message}
          </p>
        )}
        <p className="text-xs text-text/45">
          {space?.name ?? "Workspace"}
          {folder ? ` / ${folder.name}` : ""}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {board?.name ?? "Choose a board"}
        </h1>
        <p className="mt-1 text-sm text-text/55">
          {board
            ? "Keep work moving across the team."
            : "Select a board from the sidebar to see its work."}
        </p>
      </div>
      <BoardViewTabs view={view} onChange={setView} />
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto p-6">
        {boardAccessDenied ? (
          <div className="flex h-full items-center justify-center">
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/5 px-8 py-6 text-sm text-red-600"
            >
              403: You do not have access to this board.
            </p>
          </div>
        ) : board ? (
          view === "board" ? (
            <Board
              name={board.name}
              statuses={boardStatuses}
              tasks={boardTasks}
              currentUserId={currentUserId}
              users={users}
              onOpenTask={(task) => setDetailTaskId(task.id)}
              onAddTask={(status) => setNewTaskStatusId(status.id)}
            />
          ) : (
            <BoardList
              statuses={boardStatuses}
              tasks={boardTasks}
              users={users}
              currentUserId={currentUserId}
              onAddTask={(status) => setNewTaskStatusId(status.id)}
              onOpenTask={(task) => setDetailTaskId(task.id)}
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="rounded-xl border border-dashed border-brand-primary/15 px-8 py-6 text-sm text-text/50">
              Choose a board from the workspace tree.
            </p>
          </div>
        )}
      </div>
      {board && newTaskStatus && (
        <TaskCreateModal
          key={newTaskStatus.id}
          listId={board.id}
          status={newTaskStatus}
          onClose={() => setNewTaskStatusId(null)}
        />
      )}
      <TaskDetailModal task={detailTask} status={detailTask ? boardStatuses.find((item) => item.id === detailTask.statusId) : undefined} users={users} onClose={() => setDetailTaskId(null)} />
    </Paper>
  );
}
