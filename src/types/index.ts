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
  id: number;
  name: string;
  description?: string;
  owner: string;
  progress: number;
  projectStatus: 0 | 1 | 2 | 3; // 0=unspecified, 1=pending, 2=approved, 3=rejected
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
  bank: number;
  whitelist: string[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  owner: string;
  bank: number;
  whitelist: string[];
  providerId?: string;
  projectStatus?: 0 | 1 | 2 | 3;
}

export interface UpdateProjectRequest {
  name?: string;
  progress?: number;
  description?: string;
  bank?: number;
  whitelist?: string[];
  providerId?: string;
  projectStatus?: 0 | 1 | 2 | 3;
}

export interface Step {
  id: number;
  projectId?: number;
  title: string;
  description: string;
  status: 0 | 1 | 2; // 0=todo, 1=in-progress, 2=done
  completed?: boolean;
  order?: number;
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
  stepId?: number;
  title: string;
  image?: string;
  description?: string;
  link?: string;
  taskOwner?: string;
  builder?: string; // User address
  createdAt: Date;
  updatedAt: Date;
  effort?: number; // Fibonacci integer
  priority?: TaskPriority;
  status: TaskStatus;
  claimedAt?: Date;
  duration?: number; // in hours
  dueDate?: Date;
  dueDateStatus?: number;
}

export interface CreateTaskRequest {
  projectId: number;
  stepId?: number;
  title: string;
  image?: string;
  description?: string;
  link?: string;
  taskOwner?: string;
  builder?: string;
  effort?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
  duration?: number;
  dueDate?: Date;
  dueDateStatus?: number;
}

export interface UpdateTaskRequest {
  stepId?: number;
  title?: string;
  image?: string;
  description?: string;
  link?: string;
  taskOwner?: string;
  builder?: string;
  effort?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
  claimedAt?: Date;
  duration?: number;
  dueDate?: Date;
  dueDateStatus?: number;
}

// ----------- Category types ----------- //
export interface Category {
  id: number;
  name: string;
}

export interface CreateStepRequest {
  title: string;
  description?: string;
  projectId: number;
  order: number;
  status?: 0 | 1 | 2;
}

export interface UpdateStepRequest {
  title?: string;
  description?: string;
  order?: number;
  status?: 0 | 1 | 2;
}

// ----------- Column types ----------- //
export interface Column {
  id: number;
  title: string;
  color: string;
  headerColor: string;
}
