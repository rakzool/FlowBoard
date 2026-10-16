import type { TTask } from "../../store/types/common.types";

type TTaskCardProps = { task: TTask };

export default function TaskCard({ task }: TTaskCardProps) {
  const priorityClass = {
    urgent: "text-red-500",
    high: "text-orange-500",
    normal: "text-brand-primary",
    low: "text-text/50",
    none: "text-text/40",
  }[task.priority];

  return (
    <article className="rounded-lg border border-brand-primary/10 bg-surface p-3 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5">{task.title}</h3>
        <span className={`shrink-0 text-[10px] font-semibold uppercase ${priorityClass}`}>
          {task.priority}
        </span>
      </div>
      {task.description && <p className="text-xs leading-5 text-text/55">{task.description}</p>}
      <div className="mt-4 flex items-center justify-between text-[11px] text-text/45">
        <span>{task.assigneeIds.length ? `Assigned to ${task.assigneeIds.join(", ")}` : "Unassigned"}</span>
        <span aria-hidden="true">•••</span>
      </div>
    </article>
  );
}
