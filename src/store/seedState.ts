
import type { TContainer, TStatus, TTask } from "./types/common.types";

const containers: TContainer[] = [
  { id: "workspace-flowboard", name: "FlowBoard workspace", type: "workspace", parentId: null, position: 0, visibility: "private", archivedAt: null },
  { id: "engineering", name: "Engineering", type: "space", parentId: "workspace-flowboard", position: 0, visibility: "private", archivedAt: null },
  { id: "product", name: "Product", type: "space", parentId: "workspace-flowboard", position: 1, visibility: "private", archivedAt: null },
  { id: "platform", name: "Platform", type: "folder", parentId: "engineering", position: 0, visibility: "private", archivedAt: null },
  { id: "mobile", name: "Mobile app", type: "folder", parentId: "engineering", position: 1, visibility: "private", archivedAt: null },
  { id: "discovery", name: "Discovery", type: "folder", parentId: "product", position: 0, visibility: "private", archivedAt: null },
  { id: "list-backlog", name: "Sprint board", type: "list", parentId: "platform", position: 0, visibility: "private", archivedAt: null },
  { id: "list-bugs", name: "Bugs & fixes", type: "list", parentId: "platform", position: 1, visibility: "private", archivedAt: null },
  { id: "list-mobile", name: "Mobile roadmap", type: "list", parentId: "mobile", position: 0, visibility: "private", archivedAt: null },
  { id: "list-product", name: "Product roadmap", type: "list", parentId: "discovery", position: 0, visibility: "private", archivedAt: null },
];
const statuses: TStatus[] = [
  { id: "todo", listId: "list-backlog", name: "To do", category: "todo", color: "brand-secondary", position: 0 },
  { id: "progress", listId: "list-backlog", name: "In progress", category: "active", color: "brand-primary", position: 1 },
  { id: "done", listId: "list-backlog", name: "Done", category: "done", color: "emerald-500", position: 2 },
];
const tasks: TTask[] = [
  { id: "task-1", primaryListId: "list-backlog", parentTaskId: null, title: "Map the workspace navigation", description: "Make spaces, folders, and boards easy to scan.", statusId: "progress", priority: "high", assigneeIds: ["alice"], dueDate: null, position: 0, createdAt: "2026-10-15T09:00:00.000Z", updatedAt: "2026-10-16T09:00:00.000Z" },
  { id: "task-2", primaryListId: "list-backlog", parentTaskId: null, title: "Create the first board view", description: "Render a focused kanban board for the selected list.", statusId: "todo", priority: "normal", assigneeIds: ["alice"], dueDate: null, position: 0, createdAt: "2026-10-15T10:00:00.000Z", updatedAt: "2026-10-16T10:00:00.000Z" },
  { id: "task-3", primaryListId: "list-backlog", parentTaskId: null, title: "Connect sidebar selection", description: "Keep dashboard and navigation on the same selected board.", statusId: "done", priority: "normal", assigneeIds: [], dueDate: null, position: 0, createdAt: "2026-10-14T10:00:00.000Z", updatedAt: "2026-10-15T10:00:00.000Z" },
];

export function buildSeedState() {
  return {
    session: { currentUserId: 'alice', selectedListId: 'list-backlog' as string | null },
    board: { containers, statuses, tasks },
  };
}
