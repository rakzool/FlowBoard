import type { DragEvent } from "react";
import type { TTask, TUser } from "../../store/types/common.types";
import TaskAssignees from "../TaskDetail/TaskAssignees";
import { TASK_PRIORITY_TEXT_CLASSES } from "../../constants/board.constants";

type TTaskCardProps = {
  task: TTask;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: (event: DragEvent<HTMLElement>) => void;
  onDragEnd?: () => void;
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  onDrop?: (event: DragEvent<HTMLElement>) => void;
  users: TUser[];
  dueDateLabel: string;
  onOpen: () => void;
  subtaskCount: number;
};

export default function TaskCard({
  task,
  draggable = false,
  isDragging = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  users,
  dueDateLabel,
  onOpen,
  subtaskCount,
}: TTaskCardProps) {
  const priorityClass = TASK_PRIORITY_TEXT_CLASSES[task.priority];

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`rounded-control border border-border bg-surface p-2.5 shadow-sm ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${isDragging ? "opacity-0" : "opacity-100"}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5">{task.title}</h3>
        <span
          className={`shrink-0 rounded-full bg-brand-primary/10 px-1.5 py-0.5 text-caption font-semibold uppercase ${priorityClass}`}
        >
          {task.priority}
        </span>
      </div>
      {subtaskCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-1.5 py-0.5 text-caption font-semibold text-brand-primary">
          {subtaskCount} {subtaskCount === 1 ? "subtask" : "subtasks"}
        </span>
      )}
      {task.description && (
        <p className="text-xs leading-5 text-text/55">{task.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between gap-2 text-caption">
        <TaskAssignees assigneeIds={task.assigneeIds} users={users} />
        <span className="shrink-0 text-text/45">{dueDateLabel}</span>
      </div>
    </article>
  );
}
