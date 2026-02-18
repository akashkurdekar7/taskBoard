import { describe, it, expect, beforeEach } from "vitest";
import { useBoardStore } from "./boardStore";
import type { Task } from "../../types/task";

describe("boardStore", () => {
  beforeEach(() => {
    useBoardStore.getState().resetBoard();
  });

  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    priority: "normal",
    column: "todo",
    tags: [],
    createdAt: new Date().toISOString(),
  };

  it("should add a task", () => {
    useBoardStore.getState().addTask(mockTask);
    const { tasks, logs } = useBoardStore.getState();

    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(mockTask);
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe("created");
  });

  it("should move a task", () => {
    useBoardStore.getState().addTask(mockTask);
    useBoardStore.getState().moveTask("1", "doing");

    const { tasks, logs } = useBoardStore.getState();
    expect(tasks[0].column).toBe("doing");
    expect(logs[0].action).toBe("moved");
  });

  it("should delete a task", () => {
    useBoardStore.getState().addTask(mockTask);
    useBoardStore.getState().deleteTask("1");

    const { tasks, logs } = useBoardStore.getState();
    expect(tasks).toHaveLength(0);
    expect(logs[0].action).toBe("deleted");
  });
});
