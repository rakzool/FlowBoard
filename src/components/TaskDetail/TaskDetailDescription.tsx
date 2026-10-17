import Button from "../DesignComponents/Button";
import type { TTaskDetailFieldProps } from "../../types/taskDetail.types";

export default function TaskDetailDescription({
  task,
  editing,
  description,
  onDescriptionChange,
  onEdit,
  onSave,
  canEdit,
}: TTaskDetailFieldProps) {
  return (
    <div className="rounded-xl border border-brand-primary/10 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-text/45">
          Description
        </span>
        {canEdit && (
          <Button
            type="button"
            variant="subtle"
            onClick={() => onEdit("description")}
            className="px-2 py-1 text-xs"
          >
            {editing === "description" ? "Cancel" : "Edit"}
          </Button>
        )}
      </div>
      {editing === "description" ? (
        <div className="space-y-2">
          <textarea
            autoFocus
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            rows={6}
            className="w-full rounded-lg border border-brand-primary/15 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
          />
          <Button
            type="button"
            variant="primary"
            onClick={() => onSave({ description })}
            className="px-3 py-2 text-xs"
          >
            Save description
          </Button>
        </div>
      ) : (
        <p className="whitespace-pre-wrap leading-6 text-text/65">
          {task.description || "No description added."}
        </p>
      )}
    </div>
  );
}
