import { create } from "zustand";
import { Task } from "../types";
import {
  getTasks,
  getTasksByProject,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  CreateTaskRequest,
  UpdateTaskRequest,
  assignTaskToSelf,
} from "../api/tasks";
import { getFriendlyErrorMessage, logError } from "../utils/errorHandler";

interface TaskState {
  // State
  tasks: Task[];
  selectedTask: Task | null;
  lastProjectId: string | null;
  tasksLoading: boolean;
  tasksError: string | null;

  // Actions
  fetchTasks: (projectId?: string) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  createNewTask: (data: CreateTaskRequest) => Promise<Task | null>;
  updateExistingTask: (
    id: string,
    data: UpdateTaskRequest
  ) => Promise<Task | null>;
  removeTask: (id: string) => Promise<boolean>;
  setSelectedTask: (task: Task | null) => void;
  refetchTasks: () => Promise<void>;
  assignTaskToSelf: (
    taskId: number,
    builderAddress: string
  ) => Promise<Task | null>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  selectedTask: null,
  lastProjectId: null,
  tasksLoading: false,
  tasksError: null,

  // Actions
  fetchTasks: async (projectId?: string) => {
    set({
      tasksLoading: true,
      tasksError: null,
      lastProjectId: projectId ?? null,
    });
    try {
      const data = projectId
        ? await getTasksByProject(projectId)
        : await getTasks();
      set({ tasks: data, tasksLoading: false });
    } catch (err) {
      logError("TaskStore.fetchTasks", err);
      set({
        tasksError: getFriendlyErrorMessage(err),
        tasksLoading: false,
      });
    }
  },

  fetchTask: async (id: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const data = await getTask(id);
      set({ selectedTask: data, tasksLoading: false });
    } catch (err) {
      set({
        tasksError: err instanceof Error ? err.message : "Failed to fetch task",
        tasksLoading: false,
      });
    }
  },

  createNewTask: async (data: CreateTaskRequest) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const task = await createTask(data);
      set((state) => ({
        tasks: [...state.tasks, task],
        tasksLoading: false,
      }));
      return task;
    } catch (err) {
      logError("TaskStore.createNewTask", err);
      set({
        tasksError: getFriendlyErrorMessage(err),
        tasksLoading: false,
      });
      return null;
    }
  },

  updateExistingTask: async (id: string, data: UpdateTaskRequest) => {
    // Optimistic update - update UI immediately before API call
    const taskId = parseInt(id);
    let previousTasks: Task[] = [];

    set((state) => {
      previousTasks = state.tasks; // Save for rollback on error
      return {
        tasks: state.tasks.map((t) =>
          t.id === taskId ? ({ ...t, ...data } as Task) : t
        ),
      };
    });

    // Then make the API call in the background
    try {
      const updatedTask = await updateTask(id, data);
      // Update with the real data from server
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        selectedTask:
          state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
      }));
      return updatedTask;
    } catch (err) {
      // Rollback on error
      logError("TaskStore.updateExistingTask", err);
      set({
        tasks: previousTasks,
        tasksError: getFriendlyErrorMessage(err),
      });
      return null;
    }
  },

  removeTask: async (id: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      await deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== parseInt(id)),
        tasksLoading: false,
      }));
      return true;
    } catch (err) {
      logError("TaskStore.removeTask", err);
      set({
        tasksError: getFriendlyErrorMessage(err),
        tasksLoading: false,
      });
      return false;
    }
  },

  setSelectedTask: (task) => set({ selectedTask: task }),

  refetchTasks: async () => {
    const { lastProjectId, fetchTasks } = get();
    await fetchTasks(lastProjectId ?? undefined);
  },

  assignTaskToSelf: async (taskId: number, builderAddress: string) => {
    // Optimistic update - update UI immediately
    let previousTasks: Task[] = [];

    set((state) => {
      previousTasks = state.tasks; // Save for rollback on error
      return {
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? ({ ...t, builder: builderAddress, status: 1 } as Task) // Auto-move to "In Progress"
            : t
        ),
      };
    });

    // Then make the API call in the background
    try {
      const updatedTask = await assignTaskToSelf(
        taskId.toString(),
        builderAddress
      );
      // Update with the real data from server
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        selectedTask:
          state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
      }));
      return updatedTask;
    } catch (err) {
      // Rollback on error
      logError("TaskStore.assignTaskToSelf", err);
      set({
        tasks: previousTasks,
        tasksError: getFriendlyErrorMessage(err),
      });
      return null;
    }
  },
}));
