import type { DragEvent } from "react";
import type { TTask, TUser } from "../../store/types/common.types";
import TaskAssignees from "../TaskDetail/TaskAssignees";

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
  const priorityClass = {
    urgent: "text-red-500",
    high: "text-orange-500",
    normal: "text-brand-primary",
    low: "text-text/50",
    none: "text-text/40",
  }[task.priority];

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
      className={`rounded-lg border border-brand-primary/10 bg-surface p-3 shadow-sm ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${isDragging ? "opacity-0" : "opacity-100"}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5">{task.title}</h3>
        <span
          className={`shrink-0 rounded-full bg-brand-primary/10 px-2 py-1 text-[10px] font-semibold uppercase ${priorityClass}`}
        >
          {task.priority}
        </span>
      </div>
      {subtaskCount > 0 && (
        <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-2 py-1 text-[10px] font-semibold text-brand-primary">
          {subtaskCount} {subtaskCount === 1 ? "subtask" : "subtasks"}
        </span>
      )}
      {task.description && (
        <p className="text-xs leading-5 text-text/55">{task.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between gap-2 text-[11px]">
        <TaskAssignees assigneeIds={task.assigneeIds} users={users} />
        <span className="shrink-0 text-text/45">{dueDateLabel}</span>
      </div>
    </article>
  );
}
