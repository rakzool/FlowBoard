import Paper from "../DesignComponents/Paper";
import Button from "../DesignComponents/Button";
import BoardViewTabs from "../Board/BoardViewTabs";
import TaskDetailModal from "../TaskDetail/TaskDetailModal";
import TaskCreateModal from "../TaskDetail/TaskCreateModal";
import useDashboard from "../../hooks/useDashboard";
import withSuspense from "../../utils/withSuspense";

const Board = withSuspense(() => import("../Board/Board"));
const BoardList = withSuspense(() => import("../Board/BoardList"));
const BoardArchivedList = withSuspense(
  () => import("../Board/BoardArchivedList"),
);

export default function Dashboard() {
  const {
    view,
    setView,
    board,
    boardAccessDenied,
    folder,
    space,
    boardStatuses,
    boardTasks,
    boardAllTasks,
    archivedTasks,
    subtaskCounts,
    users,
    newTaskStatus,
    detailTask,
    openTask,
    openTaskCreation,
    closeTaskCreation,
    closeTaskDetails,
    archiveSelectedTask,
    unarchiveSelectedTask,
  } = useDashboard();

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
              onOpenTask={openTask}
            />
          ) : view === "board" ? (
            <Board
              name={board.name}
              statuses={boardStatuses}
              tasks={boardTasks}
              users={users}
              onOpenTask={openTask}
              subtaskCounts={subtaskCounts.active}
              onAddTask={openTaskCreation}
            />
          ) : (
            <BoardList
              statuses={boardStatuses}
              tasks={boardTasks}
              users={users}
              onAddTask={openTaskCreation}
              onOpenTask={openTask}
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
          onClose={closeTaskCreation}
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
        isArchived={Boolean(detailTask?.archivedAt)}
        onArchive={archiveSelectedTask}
        onUnarchive={unarchiveSelectedTask}
        onClose={closeTaskDetails}
      />
    </Paper>
  );
}
