import Accordion from "../DesignComponents/Accordion";
import AccordionItem from "../DesignComponents/AccordionItem";
import Button from "../DesignComponents/Button";
import Paper from "../DesignComponents/Paper";
import TaskCard from "./TaskCard";
import type { TStatus, TTask, TUser } from "../../store/types/common.types";
import { STATUS_CATEGORY_CLASSES } from "../../constants/board.constants";
import { formatShortDueDate } from "../../utils/taskFormatting";
import { BOARD_LIST_SORT_OPTIONS } from "../../constants/board.constants";
import useBoardList from "../../hooks/useBoardList";

type TBoardListProps = {
  statuses: TStatus[];
  tasks: TTask[];
  users: TUser[];
  onAddTask: (status: TStatus) => void;
  onOpenTask: (task: TTask) => void;
  subtaskCounts: Record<string, number>;
};

export default function BoardList({
  statuses,
  tasks,
  users,
  onAddTask,
  onOpenTask,
  subtaskCounts,
}: TBoardListProps) {
  const {
    sortKey,
    ascending,
    tasksByStatus,
    draggingTaskId,
    changeSort,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useBoardList({ statuses, tasks });

  return (
    <Paper className="min-w-[28rem] rounded-panel border border-border px-2 pt-2 pb-0">
      <div className="flex items-center justify-between border-b border-brand-primary/10 px-3 py-2">
        <p className="text-xs text-text/50">{tasks.length} tasks</p>
        <div className="flex items-center gap-1 text-xs text-text/55">
          <span>Sort:</span>
          {BOARD_LIST_SORT_OPTIONS.map((key) => (
            <Button
              key={key}
              type="button"
              variant="subtle"
              onClick={() => changeSort(key)}
              className="px-2 py-1"
            >
              {key === "dueDate" ? "Due date" : "Priority"}
              {sortKey === key ? (ascending ? " ↑" : " ↓") : ""}
            </Button>
          ))}
        </div>
      </div>
      <Accordion>
        {statuses.map((status) => {
          const statusTasks = tasksByStatus[status.id] ?? [];
          return (
            <AccordionItem
              key={status.id}
              title={status.name}
              defaultOpen
              icon={
                <span
                  className={`h-2 w-2 rounded-full ${STATUS_CATEGORY_CLASSES[status.category]}`}
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
              <div
                className="flex flex-col gap-2 border-t border-brand-primary/10 p-3"
                onDragOver={handleDragOver}
                onDrop={(event) =>
                  handleDrop(event, status.id, statusTasks.length)
                }
              >
                {statusTasks.length ? (
                  statusTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      draggable
                      isDragging={draggingTaskId === task.id}
                      onDragStart={(event) => handleDragStart(event, task.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDrop={(event) => handleDrop(event, status.id, index)}
                      users={users}
                      dueDateLabel={formatShortDueDate(task.dueDate)}
                      onOpen={() => onOpenTask(task)}
                      subtaskCount={subtaskCounts[task.id] ?? 0}
                    />
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
