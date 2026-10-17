import { describe, expect, it } from "vitest";
import {
  selectVisibleBoards,
  selectVisibleFolders,
  selectVisibleSpaces,
} from "../../src/store/selectors/accessSelectors";
import {
  addTask,
  archiveTask,
  moveTask,
  updateTask,
} from "../../src/store/reducer/boardReducer";
import { switchUser } from "../../src/store/reducer/sessionReducer";
import { buildSeedState } from "../../src/store/seedState";
import { makeStore } from "../../src/store/store";
import type { TTask } from "../../src/store/types/common.types";

const makeTask = (overrides: Partial<TTask> = {}): TTask => ({
  id: "task-test",
  primaryListId: "list-backlog",
  parentTaskId: null,
  title: "Permission test task",
  description: "Created by a store test.",
  statusId: "todo",
  priority: "normal",
  assigneeIds: [],
  dueDate: null,
  position: 1,
  createdAt: "2026-10-17T09:00:00.000Z",
  updatedAt: "2026-10-17T09:00:00.000Z",
  archivedAt: null,
  ...overrides,
});

describe("permission-filtered container tree", () => {
  it("shows Alice every seeded space and board", () => {
    const store = makeStore(buildSeedState());
    const state = store.getState();

    expect(selectVisibleSpaces(state).map((item) => item.id)).toEqual([
      "engineering",
      "product",
    ]);
    expect(selectVisibleFolders(state).map((item) => item.id)).toEqual([
      "platform",
      "mobile",
      "discovery",
    ]);
    expect(selectVisibleBoards(state).map((item) => item.id)).toEqual([
      "list-backlog",
      "list-bugs",
      "list-mobile",
      "list-product",
    ]);
  });

  it("filters the tree to Bob's granted space and its public descendants", () => {
    const store = makeStore(buildSeedState());
    store.dispatch(switchUser("bob"));
    const state = store.getState();

    expect(selectVisibleSpaces(state).map((item) => item.id)).toEqual([
      "engineering",
    ]);
    expect(selectVisibleFolders(state).map((item) => item.id)).toEqual([
      "platform",
      "mobile",
    ]);
    expect(selectVisibleBoards(state).map((item) => item.id)).toEqual([
      "list-backlog",
      "list-bugs",
      "list-mobile",
    ]);
  });
});

describe("task access", () => {
  it("moves and reorders tasks without success feedback", () => {
    const store = makeStore(buildSeedState());

    store.dispatch(
      moveTask({
        taskId: "task-1",
        statusId: "todo",
        position: 0,
        currentUserId: "alice",
      }),
    );

    expect(store.getState().board.tasks.find((task) => task.id === "task-1")).toMatchObject({
      statusId: "todo",
      position: 0,
    });
    expect(store.getState().board.lastFeedback).toBeNull();
  });

  it("allows a member to add and edit a task on an accessible board", () => {
    const store = makeStore(buildSeedState());
    store.dispatch(switchUser("bob"));

    store.dispatch(addTask({ task: makeTask(), currentUserId: "bob" }));
    expect(store.getState().board.tasks).toContainEqual(makeTask());

    store.dispatch(
      updateTask({
        id: "task-test",
        changes: { title: "Updated by Bob" },
        currentUserId: "bob",
      }),
    );
    expect(
      store.getState().board.tasks.find((task) => task.id === "task-test")
        ?.title,
    ).toBe("Updated by Bob");
  });

  it("rejects task mutations on a board outside the member's tree", () => {
    const store = makeStore(buildSeedState());
    const productTask = makeTask({
      id: "product-task",
      primaryListId: "list-product",
      statusId: "list-product-todo",
    });
    store.dispatch(addTask({ task: productTask, currentUserId: "alice" }));
    store.dispatch(switchUser("bob"));

    store.dispatch(
      addTask({
        task: makeTask({
          id: "second-product-task",
          primaryListId: "list-product",
          statusId: "list-product-todo",
        }),
        currentUserId: "bob",
      }),
    );
    store.dispatch(
      updateTask({
        id: "product-task",
        changes: { title: "No access" },
        currentUserId: "bob",
      }),
    );
    store.dispatch(
      archiveTask({ taskId: "product-task", currentUserId: "bob" }),
    );
    store.dispatch(
      moveTask({
        taskId: "product-task",
        statusId: "list-product-progress",
        position: 0,
        currentUserId: "bob",
      }),
    );

    expect(
      store
        .getState()
        .board.tasks.find((task) => task.id === "second-product-task"),
    ).toBeUndefined();
    expect(
      store.getState().board.tasks.find((task) => task.id === "product-task")
        ?.title,
    ).toBe("Permission test task");
    expect(
      store.getState().board.tasks.find((task) => task.id === "product-task")
        ?.archivedAt,
    ).toBeNull();
    expect(store.getState().board.lastError?.code).toBe("FORBIDDEN");
  });
});
