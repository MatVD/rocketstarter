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
} from "../api/tasks";

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
  updateExistingTask: (id: string, data: UpdateTaskRequest) => Promise<Task | null>;
  removeTask: (id: string) => Promise<boolean>;
  setSelectedTask: (task: Task | null) => void;
  refetchTasks: () => Promise<void>;
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
      const data = projectId ? await getTasksByProject(projectId) : await getTasks();
      set({ tasks: data, tasksLoading: false });
    } catch (err) {
      set({
        tasksError:
          err instanceof Error ? err.message : "Failed to fetch tasks",
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
        tasksError:
          err instanceof Error ? err.message : "Failed to fetch task",
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
      set({
        tasksError:
          err instanceof Error ? err.message : "Failed to create task",
        tasksLoading: false,
      });
      return null;
    }
  },

  updateExistingTask: async (id: string, data: UpdateTaskRequest) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const updatedTask = await updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === parseInt(id) ? updatedTask : t
        ),
        selectedTask:
          state.selectedTask?.id === parseInt(id)
            ? updatedTask
            : state.selectedTask,
        tasksLoading: false,
      }));
      return updatedTask;
    } catch (err) {
      set({
        tasksError:
          err instanceof Error ? err.message : "Failed to update task",
        tasksLoading: false,
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
      set({
        tasksError:
          err instanceof Error ? err.message : "Failed to delete task",
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
}));
