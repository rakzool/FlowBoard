import { useState } from "react";
import Button from "../DesignComponents/Button";
import Input from "../DesignComponents/Input";
import DatePicker from "../DesignComponents/DatePicker";
import Modal from "../DesignComponents/Modal";
import Select from "../DesignComponents/Select";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addTask } from "../../store/reducer/boardReducer";
import type { TPriority, TStatus } from "../../store/types/common.types";

type TTaskCreateModalProps = {
  listId: string;
  status: TStatus | null;
  onClose: () => void;
};

const priorities = ["urgent", "high", "normal", "low", "none"].map((value) => ({
  value,
  label: value,
}));

export default function TaskCreateModal({
  listId,
  status,
  onClose,
}: TTaskCreateModalProps) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.board.tasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TPriority>("normal");
  const [assigneeId, setAssigneeId] = useState("");
  const users = useAppSelector((state) => state.board.users);
  const currentUserId = useAppSelector((state) => state.session.currentUserId);
  const [dueDate, setDueDate] = useState("");

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!status || !title.trim()) return;
    const statusTasks = tasks.filter((task) => task.statusId === status.id);
    dispatch(
      addTask({
        currentUserId,
        task: {
          id: `task-${Date.now()}`,
          primaryListId: listId,
          parentTaskId: null,
          title: title.trim(),
          description: description.trim() || undefined,
          statusId: status.id,
          priority,
          assigneeIds: assigneeId ? [assigneeId] : [],
          dueDate: dueDate
            ? new Date(`${dueDate}T00:00:00.000Z`).toISOString()
            : null,
          position: statusTasks.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    );
    onClose();
  };

  return (
    <Modal
      open={Boolean(status)}
      title={`Add task to ${status?.name ?? "board"}`}
      onClose={onClose}
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={submit}>
        <div className="sm:col-span-2">
          <Input
            autoFocus
            maxLength={500}
            placeholder="Task title"
            value={title}
            changeHandler={(event) => setTitle(event.target.value)}
          />
        </div>
        <label className="flex flex-col gap-1 text-sm text-text/65 sm:col-span-2">
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="rounded-lg border border-brand-primary/15 bg-surface px-3 py-2 text-sm outline-none focus:border-brand-primary"
            placeholder="Add context for this task"
          />
        </label>
        <Select
          label="Priority"
          value={priority}
          options={priorities}
          onChange={(value) => setPriority(value as TPriority)}
        />
        <DatePicker label="Due date" value={dueDate} onChange={setDueDate} />
        <div className="sm:col-span-2">
          <Select
            label="Assignee"
            value={assigneeId}
            options={[
              { value: "", label: "Unassigned" },
              ...users.map((user) => ({ value: user.id, label: user.name })),
            ]}
            onChange={setAssigneeId}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="px-3 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!title.trim()}
            className="px-4 py-2 text-sm"
          >
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
