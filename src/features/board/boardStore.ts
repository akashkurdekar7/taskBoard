import type { Task, ColumnType, ActivityLog } from "../../types/task";
import { create } from "zustand";

interface BoardState {
  tasks: Task[];
  logs: ActivityLog[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, column: ColumnType) => void;
  loadTasks: () => void;
  resetBoard: () => void;
}

const STORAGE_KEY = "task-board";

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: [],
  logs: [],

  addTask: (task) => {
    const updated = [...get().tasks, task];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      taskId: task.id,
      taskTitle: task.title,
      action: "created",
      timestamp: new Date().toISOString(),
      details: `Created in ${task.column}`
    };

    set((state) => ({
      tasks: updated,
      logs: [newLog, ...state.logs].slice(0, 50)
    }));
  },

  updateTask: (updatedTask) => {
    const updated = get().tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      taskId: updatedTask.id,
      taskTitle: updatedTask.title,
      action: "updated",
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      tasks: updated,
      logs: [newLog, ...state.logs].slice(0, 50)
    }));
  },

  deleteTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    const updated = get().tasks.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (task) {
      const newLog: ActivityLog = {
        id: crypto.randomUUID(),
        taskId: id,
        taskTitle: task.title,
        action: "deleted",
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        tasks: updated,
        logs: [newLog, ...state.logs].slice(0, 50)
      }));
    } else {
      set({ tasks: updated });
    }
  },

  moveTask: (id, column) => {
    const task = get().tasks.find(t => t.id === id);
    const updated = get().tasks.map((t) =>
      t.id === id ? { ...t, column } : t
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (task && task.column !== column) {
      const newLog: ActivityLog = {
        id: crypto.randomUUID(),
        taskId: id,
        taskTitle: task.title,
        action: "moved",
        timestamp: new Date().toISOString(),
        details: `Moved from ${task.column} to ${column}`
      };
      set((state) => ({
        tasks: updated,
        logs: [newLog, ...state.logs].slice(0, 50)
      }));
    } else {
      set({ tasks: updated });
    }
  },

  loadTasks: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        set({ tasks: parsed });
      }
    } catch {
      set({ tasks: [] });
    }
  },

  resetBoard: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ tasks: [], logs: [] });
  },
}));
