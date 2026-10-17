import type { Dispatch, SetStateAction } from "react";
import type {
  TStatus,
  TTask,
  TTaskUpdate,
  TUser,
} from "../store/types/common.types";

export type TEditingField =
  | "title"
  | "description"
  | "status"
  | "priority"
  | "dueDate"
  | "assignee"
  | null;

export type TTaskDetailModalProps = {
  task: TTask | null;
  status?: TStatus;
  statuses: TStatus[];
  tasks: TTask[];
  users: TUser[];
  currentUserId: string;
  canEdit: boolean;
  isArchived: boolean;
  onArchive: (task: TTask) => void;
  onUnarchive: (task: TTask) => void;
  onClose: () => void;
};

export type TTaskDetailEditorProps = Omit<
  TTaskDetailModalProps,
  "task" | "onClose"
> & {
  task: TTask;
  editing: TEditingField;
  title: string;
  description: string;
  priority: TTask["priority"];
  statusId: string;
  dueDate: string;
  assigneeId: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: TTask["priority"]) => void;
  onStatusChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onEdit: (field: Exclude<TEditingField, null>) => void;
  onSave: (changes: TTaskUpdate["changes"]) => void;
  onCreateSubtask: () => void;
  onOpenSubtask: (task: TTask) => void;
};

export type TTaskDetailFieldProps = Pick<
  TTaskDetailEditorProps,
  | "task"
  | "editing"
  | "onEdit"
  | "onSave"
  | "title"
  | "description"
  | "onTitleChange"
  | "onDescriptionChange"
> & {
  canEdit: boolean;
};

export type TTaskDetailMetadataProps = Pick<
  TTaskDetailEditorProps,
  | "task"
  | "status"
  | "statuses"
  | "users"
  | "editing"
  | "priority"
  | "statusId"
  | "dueDate"
  | "assigneeId"
  | "onPriorityChange"
  | "onStatusChange"
  | "onDueDateChange"
  | "onAssigneeChange"
  | "onEdit"
  | "onSave"
> & {
  canEdit: boolean;
  isArchived: boolean;
  onArchive: (task: TTask) => void;
  onUnarchive: (task: TTask) => void;
};

export type TTaskDetailSubtasksProps = Pick<
  TTaskDetailEditorProps,
  | "task"
  | "tasks"
  | "canEdit"
  | "isArchived"
  | "onCreateSubtask"
  | "onOpenSubtask"
>;

export type TTaskDetailStateSetters = {
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setPriority: Dispatch<SetStateAction<TTask["priority"]>>;
  setStatusId: Dispatch<SetStateAction<string>>;
  setDueDate: Dispatch<SetStateAction<string>>;
  setAssigneeId: Dispatch<SetStateAction<string>>;
};
