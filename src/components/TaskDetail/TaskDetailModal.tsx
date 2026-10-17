import { useState } from "react";
import Modal from "../DesignComponents/Modal";
import withSuspense from "../../utils/withSuspense";
import { useAppDispatch } from "../../store/hooks";
import { updateTask } from "../../store/reducer/boardReducer";
import type { TTask } from "../../store/types/common.types";
import type {
  TTaskDetailModalProps,
  TTaskDetailStateSetters,
  TEditingField,
} from "../../types/taskDetail.types";

const TaskDetailContent = withSuspense(() => import("./TaskDetailContent"));
const TaskCreateModal = withSuspense(() => import("./TaskCreateModal"));

const dateValue = (value: string | null) => (value ? value.slice(0, 10) : "");

export default function TaskDetailModal({
  task,
  status,
  statuses,
  tasks,
  users,
  currentUserId,
  canEdit,
  isArchived,
  onArchive,
  onUnarchive,
  onClose,
}: TTaskDetailModalProps) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState<TEditingField>(null);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<TTask["priority"]>(
    task?.priority ?? "normal",
  );
  const [statusId, setStatusId] = useState(task?.statusId ?? "");
  const [dueDate, setDueDate] = useState(dateValue(task?.dueDate ?? null));
  const [assigneeId, setAssigneeId] = useState(task?.assigneeIds[0] ?? "");
  const [creatingSubtask, setCreatingSubtask] = useState(false);
  const [selectedSubtaskId, setSelectedSubtaskId] = useState<string | null>(
    null,
  );
  if (!task)
    return (
      <Modal open={false} title="Task details" onClose={onClose}>
        {null}
      </Modal>
    );
  const setters: TTaskDetailStateSetters = {
    setTitle,
    setDescription,
    setPriority,
    setStatusId,
    setDueDate,
    setAssigneeId,
  };
  const save = (changes: Parameters<typeof updateTask>[0]["changes"]) => {
    dispatch(updateTask({ id: task.id, changes, currentUserId }));
    setEditing(null);
  };
  const selectedSubtask =
    tasks.find((item) => item.id === selectedSubtaskId) ?? null;
  const contentProps = {
    task,
    status,
    statuses,
    tasks,
    users,
    currentUserId,
    canEdit,
    isArchived,
    onArchive,
    onUnarchive,
    editing,
    title,
    description,
    priority,
    statusId,
    dueDate,
    assigneeId,
    onTitleChange: setters.setTitle,
    onDescriptionChange: setters.setDescription,
    onPriorityChange: setters.setPriority,
    onStatusChange: setters.setStatusId,
    onDueDateChange: setters.setDueDate,
    onAssigneeChange: setters.setAssigneeId,
    onEdit: setEditing,
    onSave: save,
    onCreateSubtask: () => setCreatingSubtask(true),
    onOpenSubtask: (subtask: TTask) => setSelectedSubtaskId(subtask.id),
  };
  return (
    <Modal open title="Task details" onClose={onClose} size="xl">
      <TaskDetailContent {...contentProps} />
      {creatingSubtask && (
        <TaskCreateModal
          listId={task.primaryListId}
          status={status ?? null}
          parentTaskId={task.id}
          onClose={() => setCreatingSubtask(false)}
        />
      )}
      {selectedSubtask && (
        <TaskDetailModal
          key={selectedSubtask.id}
          task={selectedSubtask}
          status={statuses.find((item) => item.id === selectedSubtask.statusId)}
          statuses={statuses}
          tasks={tasks}
          users={users}
          currentUserId={currentUserId}
          canEdit={canEdit}
          isArchived={Boolean(selectedSubtask.archivedAt)}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onClose={() => setSelectedSubtaskId(null)}
        />
      )}
    </Modal>
  );
}
