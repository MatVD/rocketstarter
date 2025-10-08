// ----------- User types ----------- //
export interface User {
  address: string;
  role: "owner" | "builder";
  username?: string;
  email?: string;
  createdAt: Date;
}

export interface CreateUserRequest {
  address: string;
  role: "Owner" | "Builder";
  username?: string;
  email?: string;
}

export interface UpdateUserRequest {
  role?: "Owner" | "Builder";
  username?: string;
  email?: string;
}

// ----------- Project types ----------- //
export interface Project {
  id: string;
  name: string;
  description?: string;
  progress?: number;
  environment?: "testnet" | "mainnet";
  owner?: string;
  ownerAddress?: string;
  createdAt?: string;
  updatedAt?: string;
  categories?: string[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  owner: string;
}

export interface UpdateProjectRequest {
  name?: string;
  progress?: number;
  description?: string;
}

// ---------- Task types ---------- //
export type TaskPriority = 0 | 1 | 2;
export const TaskPriorityLabel: Record<TaskPriority, string> = {
  0: "low",
  1: "medium",
  2: "high",
};

export type TaskStatus = 0 | 1 | 2 | 3;
export const TaskStatusLabel: Record<TaskStatus, string> = {
  0: "todo",
  1: "inprogress",
  2: "inreview",
  3: "done",
};

export interface Task {
  id: number;
  projectId: number;
  stepId?: string;
  title: string;
  description?: string;
  link?: string;
  builder?: string; // User address
  createdAt: Date;
  updatedAt: Date;
  effort?: string;
  priority?: TaskPriority;
  status: TaskStatus;
}

export interface CreateTaskRequest {
  projectId: number;
  stepId?: string;
  title: string;
  description?: string;
  link?: string;
  builder?: string;
  effort?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

export interface UpdateTaskRequest {
  stepId?: string;
  title?: string;
  description?: string;
  link?: string;
  builder?: string;
  effort?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

// ----------- Category types ----------- //
export interface Category {
  id: number;
  name: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  completed?: boolean;
}

export interface Column {
  id: number;
  title: string;
  color: string;
  headerColor: string;
}
