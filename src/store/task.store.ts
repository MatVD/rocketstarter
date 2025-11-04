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
  assignTaskToSelf: (taskId: number, builderAddress: string) => Promise<Task | null>;
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
    const taskId = parseInt(id);
    
    // 1. Optimistic update - Update UI immediately WITHOUT loading state
    // This prevents full page re-render and gives instant feedback
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        
        // Merge update data with existing task
        const updatedTask = {
          ...t,
          ...data,
          // Map builderAddress from API to builder in Task type
          builder: data.builderAddress !== undefined ? data.builderAddress : t.builder,
          // Ensure stepId is number if provided
          stepId: data.stepId !== undefined 
            ? (typeof data.stepId === 'string' ? parseInt(data.stepId) : data.stepId)
            : t.stepId,
        } as Task;
        
        return updatedTask;
      }),
      // ⚠️ NO tasksLoading: true here to avoid re-rendering all components
    }));

    try {
      // 2. API call in background
      const updatedTask = await updateTask(id, data);
      
      // 3. Confirm with backend data
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? updatedTask : t
        ),
        selectedTask:
          state.selectedTask?.id === taskId
            ? updatedTask
            : state.selectedTask,
      }));
      
      return updatedTask;
    } catch (err) {
      // 4. Rollback on error - refetch to restore correct state
      set({
        tasksError:
          err instanceof Error ? err.message : "Failed to update task",
      });
      
      // Refetch all tasks to restore correct state after error
      const { fetchTasks, lastProjectId } = get();
      await fetchTasks(lastProjectId ?? undefined);
      
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

  assignTaskToSelf: async (taskId: number, builderAddress: string) => {
    // 1. Optimistic update - Update UI immediately WITHOUT loading state
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          builder: builderAddress,
          status: 1, // Move to "in progress"
        } as Task;
      }),
      selectedTask:
        state.selectedTask?.id === taskId
          ? { ...state.selectedTask, builder: builderAddress, status: 1 }
          : state.selectedTask,
      // ⚠️ NO tasksLoading: true to avoid re-rendering
    }));

    try {
      // 2. API call in background
      const updatedTask = await assignTaskToSelf(taskId.toString(), builderAddress);
      
      // 3. Confirm with backend data
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? updatedTask : t
        ),
        selectedTask:
          state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
      }));
      return updatedTask;
    } catch (err) {
      // 4. Rollback on error
      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            builder: undefined,
            status: 0, // Revert to "todo"
          } as Task;
        }),
        tasksError:
          err instanceof Error ? err.message : "Failed to assign task",
      }));
      return null;
    }
  }
}));
