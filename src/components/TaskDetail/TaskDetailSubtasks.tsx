import Button from "../DesignComponents/Button";
import type { TTaskDetailSubtasksProps } from "../../types/taskDetail.types";

export default function TaskDetailSubtasks({
  task,
  tasks,
  canEdit,
  isArchived,
  onCreateSubtask,
  onOpenSubtask,
}: TTaskDetailSubtasksProps) {
  const subtasks = tasks
    .filter(
      (item) =>
        item.parentTaskId === task.id &&
        Boolean(item.archivedAt) === isArchived,
    )
    .sort((a, b) => a.position - b.position);
  return (
    <div className="rounded-panel border border-border p-3">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold">Subtasks</h4>
          <p className="text-xs text-text/45">
            {subtasks.length} {subtasks.length === 1 ? "subtask" : "subtasks"}
          </p>
        </div>
        {canEdit && task.parentTaskId === null && (
          <Button
            type="button"
            variant="primary"
            onClick={onCreateSubtask}
            className="px-3 py-2 text-xs"
          >
            Add subtask
          </Button>
        )}
      </div>
      {subtasks.length ? (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <Button
              key={subtask.id}
              type="button"
              variant="ghost"
              onClick={() => onOpenSubtask(subtask)}
              className="flex w-full items-center justify-between border border-border px-3 py-2 text-left"
            >
              <span className="truncate">{subtask.title}</span>
              <span className="ml-3 shrink-0 text-xs capitalize text-text/50">
                {subtask.priority}
              </span>
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text/50">No subtasks yet.</p>
      )}
    </div>
  );
}
