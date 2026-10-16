import { useState, type DragEvent } from "react";
import Accordion from "../DesignComponents/Accordion";
import Button from "../DesignComponents/Button";
import Paper from "../DesignComponents/Paper";
import type { TStatus, TTask } from "../../store/types/common.types";
import withSuspense from "../../utils/withSuspense";
import { useAppDispatch } from "../../store/hooks";
import { moveTask } from "../../store/reducer/boardReducer";

const AccordionItem = withSuspense(
  () => import("../DesignComponents/AccordionItem"),
);
const TaskCard = withSuspense(() => import("./TaskCard"));

type TBoardListProps = {
  statuses: TStatus[];
  tasks: TTask[];
  onAddTask: (status: TStatus) => void;
};

export default function BoardList({
  statuses,
  tasks,
  onAddTask,
}: TBoardListProps) {
  const dispatch = useAppDispatch();
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const handleDrop = (event: DragEvent<HTMLElement>, statusId: string, position: number) => {
    event.preventDefault();
    event.stopPropagation();
    const taskId = event.dataTransfer.getData("text/plain");
    const task = tasks.find((item) => item.id === taskId);
    if (task && task.statusId === statusId) dispatch(moveTask({ taskId, statusId, position }));
    setDraggingTaskId(null);
  };

  return (
    <Paper className="min-w-[28rem] rounded-xl border border-brand-primary/10 p-2">
      <Accordion>
        {statuses.map((status) => {
          const statusTasks = tasks
            .filter((task) => task.statusId === status.id)
            .sort((a, b) => a.position - b.position);
          return (
            <AccordionItem
              key={status.id}
              title={status.name}
              defaultOpen
              icon={
                <span
                  className={`h-2 w-2 rounded-full ${status.category === "done" ? "bg-emerald-500" : status.category === "active" ? "bg-brand-primary" : "bg-brand-secondary"}`}
                />
              }
              actions={
                <div className="flex items-center gap-1">
                  <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] text-text/55">
                    {statusTasks.length}
                  </span>
                  <Button
                    type="button"
                    variant="subtle"
                    aria-label={`Add task to ${status.name}`}
                    onClick={() => onAddTask(status)}
                    className="rounded-md px-1.5 py-0.5 text-lg leading-none"
                  >
                    +
                  </Button>
                </div>
              }
            >
              <div className="flex flex-col gap-2 border-t border-brand-primary/10 p-3" onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, status.id, statusTasks.length)}>
                {statusTasks.length ? (
                  statusTasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} draggable isDragging={draggingTaskId === task.id} onDragStart={(event) => { event.dataTransfer.setData("text/plain", task.id); event.dataTransfer.effectAllowed = "move"; setDraggingTaskId(task.id); }} onDragEnd={() => setDraggingTaskId(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, status.id, index)} />
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-brand-primary/15 p-4 text-center text-xs text-text/40">
                    No tasks here yet
                  </p>
                )}
              </div>
            </AccordionItem>
          );
        })}
        {!statuses.length && (
          <p className="p-8 text-center text-sm text-text/50">
            No statuses on this board yet.
          </p>
        )}
      </Accordion>
    </Paper>
  );
}
