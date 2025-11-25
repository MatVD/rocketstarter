import api from "./client";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "../types";

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");
  return response.data.data || response.data;
};

// Get tasks by project ID
export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const response = await api.get(`/tasks?projectId=${projectId}`);
  return response.data.data || response.data;
};

// Get task by ID
export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data || response.data;
};

// Create new task
export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await api.post("/tasks", data);
  return response.data.data || response.data;
};

// Update task (with workflow rules)
export const updateTask = async (
  id: string,
  data: UpdateTaskRequest
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data.data || response.data;
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
    builder: builderAddress,
  });
};

export const releaseTask = async (taskId: string): Promise<Task> => {
  return updateTask(taskId, {
    status: 0, // Move to "todo"
    builder: undefined,
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
