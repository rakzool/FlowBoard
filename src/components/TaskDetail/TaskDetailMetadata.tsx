import Button from "../DesignComponents/Button";
import DatePicker from "../DesignComponents/DatePicker";
import Select from "../DesignComponents/Select";
import TaskAssignees from "./TaskAssignees";
import type { TPriority } from "../../store/types/common.types";
import type { TTaskDetailMetadataProps } from "../../types/taskDetail.types";
import useAccessControl from "../../hooks/useAccessControl";
import { TASK_PRIORITY_OPTIONS } from "../../constants/task.constants";
import { formatLongDueDate } from "../../utils/taskFormatting";

export default function TaskDetailMetadata({
  task,
  status,
  statuses,
  users,
  editing,
  priority,
  statusId,
  dueDate,
  assigneeId,
  onPriorityChange,
  onStatusChange,
  onDueDateChange,
  onAssigneeChange,
  onEdit,
  onSave,
  isArchived,
  onArchive,
  onUnarchive,
}: TTaskDetailMetadataProps) {
  const { canEditTask } = useAccessControl();
  const canEdit = canEditTask(task);
  const editButton = (field: Exclude<NonNullable<typeof editing>, null>) =>
    canEdit && (
      <Button
        type="button"
        variant="subtle"
        onClick={() => onEdit(field)}
        className="px-2 py-1 text-xs"
      >
        {editing === field ? "Cancel" : "Edit"}
      </Button>
    );
  return (
    <dl className="space-y-2.5 rounded-panel bg-surface-subtle p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <dt className="text-xs text-text/45">Status</dt>
          {editing === "status" ? (
            <Select
              label=""
              value={statusId}
              options={statuses.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              onChange={onStatusChange}
            />
          ) : (
            <dd className="mt-1 font-medium">{status?.name ?? "Unknown"}</dd>
          )}
        </div>
        {editing === "status" ? (
          <Button
            type="button"
            variant="primary"
            onClick={() => onSave({ statusId })}
            className="px-2 py-1 text-xs"
          >
            Save
          </Button>
        ) : (
          editButton("status")
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <dt className="text-xs text-text/45">Priority</dt>
          {editing === "priority" ? (
            <Select
              label=""
              value={priority}
              options={TASK_PRIORITY_OPTIONS}
              onChange={(value) => onPriorityChange(value as TPriority)}
            />
          ) : (
            <dd className="mt-1 font-medium capitalize">{task.priority}</dd>
          )}
        </div>
        {editing === "priority" ? (
          <Button
            type="button"
            variant="primary"
            onClick={() => onSave({ priority })}
            className="px-2 py-1 text-xs"
          >
            Save
          </Button>
        ) : (
          editButton("priority")
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <dt className="text-xs text-text/45">Due date</dt>
          {editing === "dueDate" ? (
            <DatePicker label="" value={dueDate} onChange={onDueDateChange} />
          ) : (
            <dd className="mt-1 font-medium">{formatLongDueDate(task.dueDate)}</dd>
          )}
        </div>
        {editing === "dueDate" ? (
          <Button
            type="button"
            variant="primary"
            onClick={() =>
              onSave({
                dueDate: dueDate
                  ? new Date(`${dueDate}T00:00:00.000Z`).toISOString()
                  : null,
              })
            }
            className="px-2 py-1 text-xs"
          >
            Save
          </Button>
        ) : (
          editButton("dueDate")
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <dt className="text-xs text-text/45">Assignee</dt>
          {editing === "assignee" ? (
            <Select
              label=""
              value={assigneeId}
              options={[
                { value: "", label: "Unassigned" },
                ...users.map((user) => ({ value: user.id, label: user.name })),
              ]}
              onChange={onAssigneeChange}
            />
          ) : (
            <dd className="mt-1">
              <TaskAssignees assigneeIds={task.assigneeIds} users={users} />
            </dd>
          )}
        </div>
        {editing === "assignee" ? (
          <Button
            type="button"
            variant="primary"
            onClick={() =>
              onSave({ assigneeIds: assigneeId ? [assigneeId] : [] })
            }
            className="px-2 py-1 text-xs"
          >
            Save
          </Button>
        ) : (
          editButton("assignee")
        )}
      </div>
      <div>
        <dt className="text-xs text-text/45">Task ID</dt>
        <dd className="mt-1 font-mono text-xs text-text/55">{task.id}</dd>
      </div>
      {canEdit && (
        <Button
          type="button"
          variant={isArchived ? "primary" : "ghost"}
          onClick={() => (isArchived ? onUnarchive(task) : onArchive(task))}
          className={`mt-3 w-full border px-3 py-2 text-sm ${isArchived ? "border-brand-primary" : "border-red-500/20 text-red-600 hover:bg-red-500/10"}`}
        >
          {isArchived ? "Unarchive ticket" : "Archive ticket"}
        </Button>
      )}
    </dl>
  );
}
