import Paper from "../DesignComponents/Paper";
import TaskCard from "./TaskCard";
import type { TTask, TUser } from "../../store/types/common.types";

type TBoardArchivedListProps = {
  tasks: TTask[];
  users: TUser[];
  subtaskCounts: Record<string, number>;
  onOpenTask: (task: TTask) => void;
};

const formatDueDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(new Date(value))
    : "No due date";

export default function BoardArchivedList({
  tasks,
  users,
  subtaskCounts,
  onOpenTask,
}: TBoardArchivedListProps) {
  const orderedTasks = [...tasks].sort(
    (a, b) => Date.parse(b.archivedAt ?? "") - Date.parse(a.archivedAt ?? ""),
  );
  return (
    <Paper className="min-w-[28rem] rounded-xl border border-brand-primary/10 p-4">
      <div className="mb-4 border-b border-brand-primary/10 pb-3">
        <h2 className="text-lg font-semibold">Archived tickets</h2>
        <p className="mt-1 text-xs text-text/50">
          Tickets archived from this board.
        </p>
      </div>
      {orderedTasks.length ? (
        <div className="flex flex-col gap-2">
          {orderedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              dueDateLabel={formatDueDate(task.dueDate)}
              subtaskCount={subtaskCounts[task.id] ?? 0}
              onOpen={() => onOpenTask(task)}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-brand-primary/15 p-8 text-center text-sm text-text/50">
          No archived tickets on this board.
        </p>
      )}
    </Paper>
  );
}
