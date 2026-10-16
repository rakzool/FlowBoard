import { useState } from "react";
import Paper from "../DesignComponents/Paper";
import type { TStatus, TTask } from "../../store/types/common.types";
import withSuspense from "../../utils/withSuspense";
import { useAppDispatch } from "../../store/hooks";
import { moveTask } from "../../store/reducer/boardReducer";

const BoardColumn = withSuspense(() => import("./BoardColumn"));

type TBoardProps = {
  name: string;
  statuses: TStatus[];
  tasks: TTask[];
  onAddTask: (status: TStatus) => void;
  currentUserId: string;
};

export default function Board({
  name,
  statuses,
  tasks,
  onAddTask,
  currentUserId,
}: TBoardProps) {
  const dispatch = useAppDispatch();
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const onMoveTask = (taskId: string, statusId: string, position: number) => {
    dispatch(moveTask({ taskId, statusId, position, currentUserId }));
    setDraggingTaskId(null);
  };
  return (
    <Paper className="flex min-h-full min-w-max flex-1 flex-col rounded-xl border border-brand-primary/10 p-4">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>
      {statuses.length ? (
        <div className="flex min-h-0 flex-1 gap-4">
          {statuses.map((status) => (
            <div key={status.id} className="contents">
              <BoardColumn
                status={status}
                onAddTask={onAddTask}
                onMoveTask={onMoveTask}
                draggingTaskId={draggingTaskId}
                onDragStart={setDraggingTaskId}
                onDragEnd={() => setDraggingTaskId(null)}
                tasks={tasks
                  .filter((task) => task.statusId === status.id)
                  .sort((a, b) => a.position - b.position)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-brand-primary/15 p-8 text-center">
          <div>
            <p className="text-sm font-medium">Your board is ready</p>
            <p className="mt-1 text-xs text-text/50">
              Statuses and tasks for {name} will appear here.
            </p>
          </div>
        </div>
      )}
    </Paper>
  );
}
