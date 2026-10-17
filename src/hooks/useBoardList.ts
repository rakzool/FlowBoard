import { useMemo, useState, type DragEvent } from "react";
import type { TStatus, TTask } from "../store/types/common.types";
import { PRIORITY_RANK } from "../store/types/common.types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { moveTask } from "../store/reducer/boardReducer";
import { BOARD_LIST_SORT_OPTIONS } from "../constants/board.constants";

type TSortKey = (typeof BOARD_LIST_SORT_OPTIONS)[number];

type TUseBoardListProps = {
  statuses: TStatus[];
  tasks: TTask[];
};

export default function useBoardList({ statuses, tasks }: TUseBoardListProps) {
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.session.currentUserId);
  const [sortKey, setSortKey] = useState<TSortKey>("dueDate");
  const [ascending, setAscending] = useState(true);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        const difference =
          sortKey === "priority"
            ? PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
            : (a.dueDate ? Date.parse(a.dueDate) : Number.MAX_SAFE_INTEGER) -
              (b.dueDate ? Date.parse(b.dueDate) : Number.MAX_SAFE_INTEGER);
        return (
          (ascending ? difference : -difference) || a.position - b.position
        );
      }),
    [ascending, sortKey, tasks],
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, TTask[]> = {};
    statuses.forEach((status) => {
      grouped[status.id] = sortedTasks.filter(
        (task) => task.statusId === status.id,
      );
    });
    return grouped;
  }, [sortedTasks, statuses]);

  const changeSort = (nextKey: TSortKey) => {
    if (nextKey === sortKey) setAscending((value) => !value);
    else {
      setSortKey(nextKey);
      setAscending(true);
    }
  };

  const handleDragStart = (event: DragEvent<HTMLElement>, taskId: string) => {
    event.dataTransfer.setData("text/plain", taskId);
    event.dataTransfer.effectAllowed = "move";
    setDraggingTaskId(taskId);
  };

  const handleDragEnd = () => setDraggingTaskId(null);
  const handleDragOver = (event: DragEvent<HTMLElement>) =>
    event.preventDefault();

  const handleDrop = (
    event: DragEvent<HTMLElement>,
    statusId: string,
    position: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const taskId = event.dataTransfer.getData("text/plain");
    const task = tasks.find((item) => item.id === taskId);
    if (task?.statusId === statusId)
      dispatch(moveTask({ taskId, statusId, position, currentUserId }));
    setDraggingTaskId(null);
  };

  return {
    sortKey,
    ascending,
    sortedTasks,
    tasksByStatus,
    draggingTaskId,
    changeSort,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
}
