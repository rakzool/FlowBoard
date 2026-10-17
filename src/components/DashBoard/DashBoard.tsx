import { useMemo, useState } from "react";
import Paper from "../DesignComponents/Paper";
import Button from "../DesignComponents/Button";
import BoardViewTabs, { type TBoardView } from "../Board/BoardViewTabs";
import BoardArchivedList from "../Board/BoardArchivedList";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { TRootState } from "../../store/reducer/rootReducer";
import withSuspense from "../../utils/withSuspense";
import type { TStatus } from "../../store/types/common.types";
import useAccessControl from "../../hooks/useAccessControl";
import TaskDetailModal from "../TaskDetail/TaskDetailModal";
import TaskCreateModal from "../TaskDetail/TaskCreateModal";
import type { TTask } from "../../store/types/common.types";
import { archiveTask, unarchiveTask } from "../../store/reducer/boardReducer";

const selectBoardState = (state: TRootState): TRootState["board"] =>
  state.board;
const selectSelectedListId = (state: TRootState): string | null =>
  state.session.selectedListId;
const Board = withSuspense(() => import("../Board/Board"));
const BoardList = withSuspense(() => import("../Board/BoardList"));

export default function Dashboard() {
  const [view, setView] = useState<TBoardView | "archived">("board");
  const [newTaskStatusId, setNewTaskStatusId] = useState<string | null>(null);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const { containers, statuses, tasks, users } =
    useAppSelector(selectBoardState);
  const dispatch = useAppDispatch();
  const selectedListId = useAppSelector(selectSelectedListId);
  const currentUserId = useAppSelector((state) => state.session.currentUserId);
  const { canAccess } = useAccessControl();
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
  const boardTasks = tasks.filter(
    (task) =>
      task.primaryListId === board?.id &&
      task.parentTaskId === null &&
      task.archivedAt === null,
  );
  const boardAllTasks = tasks.filter(
    (task) => task.primaryListId === board?.id,
  );
  const subtaskCounts = useMemo(() => {
    const active: Record<string, number> = {};
    const archived: Record<string, number> = {};
    tasks.forEach((task) => {
      if (!task.parentTaskId) return;
      const target = task.archivedAt === null ? active : archived;
      target[task.parentTaskId] = (target[task.parentTaskId] ?? 0) + 1;
    });
    return { active, archived };
  }, [tasks]);
  const archivedTasks = tasks.filter(
    (task) => task.primaryListId === board?.id && task.archivedAt !== null,
  );
  const newTaskStatus: TStatus | null =
    boardStatuses.find((status) => status.id === newTaskStatusId) ?? null;
  const detailTask: TTask | null =
    tasks.find((task) => task.id === detailTaskId) ?? null;

  return (
    <Paper className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <p className="text-xs text-text/45">
          {space?.name ?? "Workspace"}
          {folder ? ` / ${folder.name}` : ""}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          {board?.name ?? "Choose a board"}
        </h1>
        {!board && (
          <p className="mt-1 text-sm text-muted">
            Select a board from the sidebar to see its work.
          </p>
        )}
      </div>
      {view === "archived" ? (
        <div className="flex items-center gap-2 border-b border-border px-5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setView("board")}
            className="px-3 py-3 text-sm"
          >
            ← Back to board
          </Button>
          <span className="text-sm font-medium text-brand-primary">
            Archived tickets
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-border pr-5">
          <BoardViewTabs view={view} onChange={setView} />
          {board && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setView("archived")}
              className="px-3 py-3 text-sm"
            >
              Archived tickets
            </Button>
          )}
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto p-5">
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
          view === "archived" ? (
            <BoardArchivedList
              tasks={archivedTasks}
              users={users}
              subtaskCounts={subtaskCounts.archived}
              onOpenTask={(task) => setDetailTaskId(task.id)}
            />
          ) : view === "board" ? (
            <Board
              name={board.name}
              statuses={boardStatuses}
              tasks={boardTasks}
              currentUserId={currentUserId}
              users={users}
              onOpenTask={(task) => setDetailTaskId(task.id)}
              subtaskCounts={subtaskCounts.active}
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
              subtaskCounts={subtaskCounts.active}
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
      <TaskDetailModal
        key={detailTask?.id ?? "task-detail"}
        task={detailTask}
        status={
          detailTask
            ? boardStatuses.find((item) => item.id === detailTask.statusId)
            : undefined
        }
        statuses={boardStatuses}
        tasks={boardAllTasks}
        users={users}
        currentUserId={currentUserId}
        canEdit={Boolean(board)}
        isArchived={Boolean(detailTask?.archivedAt)}
        onArchive={(task) => {
          dispatch(archiveTask({ taskId: task.id, currentUserId }));
          setDetailTaskId(null);
        }}
        onUnarchive={(task) => {
          dispatch(unarchiveTask({ taskId: task.id, currentUserId }));
          setDetailTaskId(null);
        }}
        onClose={() => setDetailTaskId(null)}
      />
    </Paper>
  );
}
