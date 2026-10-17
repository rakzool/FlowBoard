export type TId = string;
export type TContainerType = 'workspace' | 'space' | 'folder' | 'list';
export type TVisibility = 'public' | 'private';
export type TPriority = 'urgent' | 'high' | 'normal' | 'low' | 'none';
export type TStatusCategory = 'todo' | 'active' | 'done';
export type TRole = 'admin' | 'member';
export type TGrantMode = 'allow' | 'deny';

export type TContainer = {
  id: TId;
  name: string;
  type: TContainerType;
  parentId: TId | null; // null only for the workspace
  position: number; // fractional index among siblings
  visibility: TVisibility;
  archivedAt: string | null; // soft-delete flag (descendants are hidden implicitly)
}
export type TContainerAccessDetails = { visibility: TVisibility; allowedUserIds: TId[]; deniedUserIds: TId[] };
export type TContainerCreate = { container: TContainer; userIds?: TId[]; deniedUserIds?: TId[]; currentUserId?: TId };
export type TContainerUpdate = { id: TId; name?: string; position?: number; currentUserId?: TId };
export type TContainerAccessUpdate = TContainerAccessDetails & { resourceId: TId; currentUserId?: TId };
export type TTaskCreate = { task: TTask; currentUserId?: TId };
export type TTaskUpdate = {
  id: TId;
  changes: Partial<Pick<TTask, "title" | "description" | "priority" | "assigneeIds" | "dueDate" | "statusId">>;
  currentUserId?: TId;
};

export type TStatus  = {
  id: TId;
  listId: TId;
  name: string;
  category: TStatusCategory;
  color: string; // Tailwind theme token, e.g. 'status-active'
  position: number;
}

export type TTask = {
  id: TId;
  primaryListId: TId;
  parentTaskId: TId | null; // max depth 1
  title: string; // <= 500 chars
  description?: string;
  statusId: TId; // must belong to primaryListId
  priority: TPriority;
  assigneeIds: TId[];
  dueDate: string | null; // ISO datetime
  position: number; // ordering within a status column
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export type TUser  = {
  id: TId;
  name: string;
  role: TRole;
}

export type TGrant = {
  id: TId; // `${resourceId}:${userId}` so upserts are natural
  resourceId: TId;
  userId: TId;
  mode: TGrantMode;
}

/** Shape accepted by entityAdapter.updateMany */
export type TPatch<T>  = {
  id: TId;
  changes: Partial<T>;
}

// ---- Consistent store result / error shape --------------------------------
export type TErrorCode = 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION' | 'CONFLICT';

// eslint-disable-next-line
export interface TStoreError {
  error: { code: TErrorCode; message: string };
}
export type TResult<T> = { data: T } | TStoreError;

export const ok = <T>(data: T): TResult<T> => ({ data });
export const fail = (code: TErrorCode, message: string): TStoreError => ({
  error: { code, message },
});
export const isError = <T>(r: TResult<T>): r is TStoreError => 'error' in r;

// ---- Domain constants -------------------------------------------------------
export const VALID_CHILD: Record<TContainerType, TContainerType[]> = {
  workspace: ['space'],
  space: ['folder', 'list'],
  folder: ['list'],
  list: [],
};

export const PRIORITY_RANK: Record<TPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
  none: 4,
};

export const MAX_TITLE_LENGTH = 500;
