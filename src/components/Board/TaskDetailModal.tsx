import Modal from "../DesignComponents/Modal";
import TaskAssignees from "./TaskAssignees";
import type { TStatus, TTask, TUser } from "../../store/types/common.types";

type TTaskDetailModalProps = {
  task: TTask | null;
  status?: TStatus;
  users: TUser[];
  onClose: () => void;
};
const formatDueDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
        new Date(value),
      )
    : "No due date";

export default function TaskDetailModal({
  task,
  status,
  users,
  onClose,
}: TTaskDetailModalProps) {
  return (
    <Modal
      open={Boolean(task)}
      title={task?.title ?? "Task details"}
      onClose={onClose}
    >
      {task && (
        <div className="space-y-5 text-sm">
          <p className="leading-6 text-text/65">
            {task.description || "No description added."}
          </p>
          <dl className="grid grid-cols-2 gap-4 rounded-xl bg-brand-primary/5 p-4">
            <div>
              <dt className="text-xs text-text/45">Status</dt>
              <dd className="mt-1 font-medium">{status?.name ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-xs text-text/45">Priority</dt>
              <dd className="mt-1 font-medium capitalize">{task.priority}</dd>
            </div>
            <div>
              <dt className="text-xs text-text/45">Due date</dt>
              <dd className="mt-1 font-medium">
                {formatDueDate(task.dueDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text/45">Assignees</dt>
              <dd className="mt-1">
                <TaskAssignees assigneeIds={task.assigneeIds} users={users} />
              </dd>
            </div>
          </dl>
        </div>
      )}
    </Modal>
  );
}
