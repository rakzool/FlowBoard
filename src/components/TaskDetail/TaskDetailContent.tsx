import withSuspense from "../../utils/withSuspense";
import type { TTaskDetailEditorProps } from "../../types/taskDetail.types";

const TaskDetailHeader = withSuspense(() => import("./TaskDetailHeader"));
const TaskDetailDescription = withSuspense(
  () => import("./TaskDetailDescription"),
);
const TaskDetailSubtasks = withSuspense(() => import("./TaskDetailSubtasks"));
const TaskDetailMetadata = withSuspense(() => import("./TaskDetailMetadata"));

export default function TaskDetailContent(props: TTaskDetailEditorProps) {
  return (
    <div className="grid gap-6 text-sm md:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5">
        <TaskDetailHeader {...props} />
        <TaskDetailDescription {...props} />
        <TaskDetailSubtasks {...props} />
      </div>
      <TaskDetailMetadata {...props} />
    </div>
  );
}
