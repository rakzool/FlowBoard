import Button from "../DesignComponents/Button";
import Input from "../DesignComponents/Input";
import type { TTaskDetailFieldProps } from "../../types/taskDetail.types";
import useAccessControl from "../../hooks/useAccessControl";

export default function TaskDetailHeader({
  task,
  editing,
  title,
  onTitleChange,
  onEdit,
  onSave,
}: TTaskDetailFieldProps) {
  const { canEditTask } = useAccessControl();
  return (
    <div className="flex items-start justify-between gap-4">
      {editing === "title" ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            autoFocus
            maxLength={500}
            placeholder="Task title"
            value={title}
            changeHandler={(event) => onTitleChange(event.target.value)}
          />
          <Button
            type="button"
            variant="primary"
            onClick={() => onSave({ title })}
            className="px-2 py-1 text-xs"
          >
            Save
          </Button>
        </div>
      ) : (
        <h3 className="text-2xl font-semibold tracking-tight">{task.title}</h3>
      )}
      {canEditTask(task) && (
        <Button
          type="button"
          variant="subtle"
          onClick={() => onEdit("title")}
          className="px-2 py-1 text-xs"
        >
          {editing === "title" ? "Cancel" : "Edit"}
        </Button>
      )}
    </div>
  );
}
