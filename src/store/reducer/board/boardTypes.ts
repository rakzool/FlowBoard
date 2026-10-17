import type {
  TBoardFeedback,
  TContainer,
  TErrorCode,
  TGrant,
  TStatus,
  TTask,
  TUser,
} from "../../types/common.types";

export type TBoardState = {
  containers: TContainer[];
  statuses: TStatus[];
  tasks: TTask[];
  users: TUser[];
  grants: TGrant[];
  lastError: { code: TErrorCode; message: string } | null;
  lastFeedback: TBoardFeedback | null;
};

export type TRemoveContainerPayload = { id: string; currentUserId?: string };
export type TMoveTaskPayload = {
  taskId: string;
  statusId: string;
  position: number;
  currentUserId?: string;
};
export type TBoardErrorPayload = { code: TErrorCode; message: string };

export const initialBoardState: TBoardState = {
  containers: [],
  statuses: [],
  tasks: [],
  users: [],
  grants: [],
  lastError: null,
  lastFeedback: null,
};
