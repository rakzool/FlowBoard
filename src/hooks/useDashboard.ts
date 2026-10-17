import { useMemo, useState } from "react";
import type { TBoardView } from "../components/Board/BoardViewTabs";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { TRootState } from "../store/reducer/rootReducer";
import { archiveTask, unarchiveTask } from "../store/reducer/boardReducer";
import type { TStatus, TTask } from "../store/types/common.types";
import useAccessControl from "./useAccessControl";

type TDashboardView = TBoardView | "archived";

const selectBoardState = (state: TRootState): TRootState["board"] =>
  state.board;
const selectSelectedListId = (state: TRootState): string | null =>
  state.session.selectedListId;

export default function useDashboard() {
  const [view, setView] = useState<TDashboardView>("board");
  const [newTaskStatusId, setNewTaskStatusId] = useState<string | null>(null);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const { containers, statuses, tasks, users } =
    useAppSelector(selectBoardState);
  const dispatch = useAppDispatch();
  const selectedListId = useAppSelector(selectSelectedListId);
  const currentUserId = useAppSelector((state) => state.session.currentUserId);
  const { canAccess } = useAccessControl();

  const board = containers.find(
    (item) =>
      item.id === selectedListId && item.type === "list" && canAccess(item),
  );
  const selectedContainer = containers.find(
    (item) => item.id === selectedListId,
  );
  const boardAccessDenied = Boolean(
    selectedContainer && !canAccess(selectedContainer),
  );
  const folder = board
    ? containers.find((item) => item.id === board.parentId)
    : undefined;
  const space = folder
    ? containers.find((item) => item.id === folder.parentId)
    : undefined;
  const boardStatuses = [...statuses]
    .filter((status) => status.listId === board?.id)
    .sort((a, b) => a.position - b.position);
  const boardTasks = tasks.filter(
    (task) =>
      task.primaryListId === board?.id &&
      task.parentTaskId === null &&
      task.archivedAt === null,
  );
  const boardAllTasks = tasks.filter(
    (task) => task.primaryListId === board?.id,
  );
  const subtaskCounts = useMemo(() => {
    const active: Record<string, number> = {};
    const archived: Record<string, number> = {};
    tasks.forEach((task) => {
      if (!task.parentTaskId) return;
      const target = task.archivedAt === null ? active : archived;
      target[task.parentTaskId] = (target[task.parentTaskId] ?? 0) + 1;
    });
    return { active, archived };
  }, [tasks]);
  const archivedTasks = tasks.filter(
    (task) => task.primaryListId === board?.id && task.archivedAt !== null,
  );
  const newTaskStatus: TStatus | null =
    boardStatuses.find((status) => status.id === newTaskStatusId) ?? null;
  const detailTask: TTask | null =
    tasks.find((task) => task.id === detailTaskId) ?? null;

  const openTask = (task: TTask) => setDetailTaskId(task.id);
  const archiveSelectedTask = (task: TTask) => {
    dispatch(archiveTask({ taskId: task.id, currentUserId }));
    setDetailTaskId(null);
  };
  const unarchiveSelectedTask = (task: TTask) => {
    dispatch(unarchiveTask({ taskId: task.id, currentUserId }));
    setDetailTaskId(null);
  };

  return {
    view,
    setView,
    board,
    boardAccessDenied,
    folder,
    space,
    boardStatuses,
    boardTasks,
    boardAllTasks,
    archivedTasks,
    subtaskCounts,
    users,
    newTaskStatus,
    detailTask,
    openTask,
    openTaskCreation: (status: TStatus) => setNewTaskStatusId(status.id),
    closeTaskCreation: () => setNewTaskStatusId(null),
    closeTaskDetails: () => setDetailTaskId(null),
    archiveSelectedTask,
    unarchiveSelectedTask,
  };
}
