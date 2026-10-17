import { useState } from "react";
import Paper from "../DesignComponents/Paper";
import type { TStatus, TTask, TUser } from "../../store/types/common.types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { moveTask } from "../../store/reducer/boardReducer";
import BoardColumn from "./BoardColumn";

type TBoardProps = {
  name: string;
  statuses: TStatus[];
  tasks: TTask[];
  onAddTask: (status: TStatus) => void;
  users: TUser[];
  onOpenTask: (task: TTask) => void;
  subtaskCounts: Record<string, number>;
};

export default function Board({
  name,
  statuses,
  tasks,
  onAddTask,
  users,
  onOpenTask,
  subtaskCounts,
}: TBoardProps) {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.session.currentUserId);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const onMoveTask = (taskId: string, statusId: string, position: number) => {
    dispatch(moveTask({ taskId, statusId, position, currentUserId }));
    setDraggingTaskId(null);
  };
  return (
    <Paper className="flex min-h-full min-w-max flex-1 flex-col rounded-panel border border-border p-3">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-base font-semibold">{name}</h2>
      </div>
      {statuses.length ? (
        <div className="flex min-h-0 flex-1 gap-3">
          {statuses.map((status) => (
            <div key={status.id} className="contents">
              <BoardColumn
                status={status}
                onAddTask={onAddTask}
                onMoveTask={onMoveTask}
                draggingTaskId={draggingTaskId}
                onDragStart={setDraggingTaskId}
                onDragEnd={() => setDraggingTaskId(null)}
                users={users}
                onOpenTask={onOpenTask}
                subtaskCounts={subtaskCounts}
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
