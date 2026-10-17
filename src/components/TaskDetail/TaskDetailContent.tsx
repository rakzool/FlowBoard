import type { TTaskDetailEditorProps } from "../../types/taskDetail.types";
import TaskDetailHeader from "./TaskDetailHeader";
import TaskDetailDescription from "./TaskDetailDescription";
import TaskDetailSubtasks from "./TaskDetailSubtasks";
import TaskDetailMetadata from "./TaskDetailMetadata";

export default function TaskDetailContent(props: TTaskDetailEditorProps) {
  return (
    <div className="grid gap-4 text-sm md:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <TaskDetailHeader {...props} />
        <TaskDetailDescription {...props} />
        <TaskDetailSubtasks {...props} />
      </div>
      <TaskDetailMetadata {...props} />
    </div>
  );
}
