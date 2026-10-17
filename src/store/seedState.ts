import rawSeedData from "../data/seedData.json";
import type {
  TContainer,
  TGrant,
  TStatus,
  TTask,
  TUser,
} from "./types/common.types";

type TSeedData = {
  users: TUser[];
  containers: TContainer[];
  statuses: TStatus[];
  tasks: TTask[];
  grants: TGrant[];
};

const seedData = rawSeedData as TSeedData;

const cloneTask = (task: TTask): TTask => ({
  ...task,
  assigneeIds: [...task.assigneeIds],
});

export function buildSeedState() {
  return {
    session: {
      currentUserId: "alice",
      selectedListId: "list-backlog" as string | null,
    },
    board: {
      containers: seedData.containers.map((container) => ({ ...container })),
      statuses: seedData.statuses.map((status) => ({ ...status })),
      tasks: seedData.tasks.map(cloneTask),
      users: seedData.users.map((user) => ({ ...user })),
      grants: seedData.grants.map((grant) => ({ ...grant })),
      lastError: null,
      lastFeedback: null,
    },
  };
}
