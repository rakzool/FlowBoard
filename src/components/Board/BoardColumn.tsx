import type { DragEvent } from "react";
import type { TStatus, TTask, TUser } from "../../store/types/common.types";
import Button from "../DesignComponents/Button";
import withSuspense from "../../utils/withSuspense";

const TaskCard = withSuspense(() => import("./TaskCard"));
const formatDueDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(new Date(value))
    : "No due date";

type TBoardColumnProps = {
  status: TStatus;
  tasks: TTask[];
  draggingTaskId: string | null;
  onAddTask: (status: TStatus) => void;
  onMoveTask: (taskId: string, statusId: string, position: number) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  users: TUser[];
  onOpenTask: (task: TTask) => void;
  subtaskCounts: Record<string, number>;
};

export default function BoardColumn({
  status,
  tasks,
  draggingTaskId,
  onAddTask,
  onMoveTask,
  onDragStart,
  onDragEnd,
  users,
  onOpenTask,
  subtaskCounts,
}: TBoardColumnProps) {
  const dotClass =
    status.category === "done"
      ? "bg-emerald-500"
      : status.category === "active"
        ? "bg-brand-primary"
        : "bg-brand-secondary";
  const handleDrop = (event: DragEvent<HTMLElement>, position: number) => {
    event.preventDefault();
    event.stopPropagation();
    const taskId = event.dataTransfer.getData("text/plain");
    if (taskId) onMoveTask(taskId, status.id, position);
  };

  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => handleDrop(event, tasks.length)}
      className="flex min-w-64 flex-1 flex-col rounded-panel bg-surface-subtle p-2.5"
    >
      <header className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          <h2 className="text-sm font-semibold">{status.name}</h2>
          <span className="rounded-full bg-brand-primary/10 px-1.5 py-0.5 text-caption text-muted">
            {tasks.length}
          </span>
        </div>
        <Button
          type="button"
          variant="subtle"
          aria-label={`Add task to ${status.name}`}
          onClick={() => onAddTask(status)}
          className="rounded-md px-2 py-0.5 text-lg leading-none"
        >
          +
        </Button>
      </header>
      <div className="flex flex-1 flex-col gap-2">
        {tasks.length ? (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              draggable
              isDragging={draggingTaskId === task.id}
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", task.id);
                event.dataTransfer.effectAllowed = "move";
                onDragStart(task.id);
              }}
              onDragEnd={onDragEnd}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, index)}
              users={users}
              dueDateLabel={formatDueDate(task.dueDate)}
              onOpen={() => onOpenTask(task)}
              subtaskCount={subtaskCounts[task.id] ?? 0}
            />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-brand-primary/15 p-4 text-center text-xs text-text/40">
            No tasks here yet
          </p>
        )}
      </div>
    </section>
  );
}
