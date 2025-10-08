import api from "./client";
import { Task } from "../types";

// Task API endpoints
export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: number;
  priority?: 0 | 1 | 2 | 3; // 0=low, 1=medium, 2=high, 3=urgent
  status?: 0 | 1 | 2 | 3; // 0=todo, 1=inprogress, 2=inreview, 3=done
  stepId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 0 | 1 | 2 | 3;
  status?: 0 | 1 | 2 | 3;
  builderAddress?: string;
  stepId?: string;
}

// Transform API response to frontend format
const transformTask = (apiTask: Task): Task => ({
  ...apiTask,
  id: apiTask.id,
  projectId: apiTask.projectId,
  status: apiTask.status,
  priority: apiTask.priority,
});

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data.map(transformTask);
};

// Get tasks by project ID
export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const response = await api.get(`/tasks?projectId=${projectId}`);
  return response.data.map(transformTask);
};

// Get task by ID
export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return transformTask(response.data);
};

// Create new task
export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await api.post("/tasks", data);
  return transformTask(response.data);
};

// Update task (with workflow rules)
export const updateTask = async (
  id: string,
  data: UpdateTaskRequest
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);
  return transformTask(response.data);
};

// Delete task
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// Builder workflow actions
export const assignTaskToSelf = async (
  taskId: string,
  builderAddress: string
): Promise<Task> => {
  return updateTask(taskId, {
    status: 1, // Move to "in progress"
    builderAddress,
  });
};

export const releaseTask = async (taskId: string): Promise<Task> => {
  return updateTask(taskId, {
    status: 0, // Move to "todo"
    builderAddress: undefined,
  });
};

export const requestReview = async (taskId: string): Promise<Task> => {
  return updateTask(taskId, {
    status: 2, // Move to "in review"
  });
};

// Owner workflow actions
export const approveTask = async (taskId: string): Promise<Task> => {
  return updateTask(taskId, {
    status: 3, // Move to "done"
  });
};
