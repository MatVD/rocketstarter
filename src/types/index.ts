// ----------- User types ----------- //
export interface User {
  address: string;
  role: "Owner" | "Builder";
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
  role: "Owner" | "Builder";
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
  bank: string; // DECIMAL stored as string to preserve precision
  whitelist: string[];
  logo?: string; // Changed from logoUrl to match backend
  slug?: string;
  categoryIds?: number[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  logoUrl?: string; // URL for project logo (backend maps to 'logo' field)
  bank?: string; // DECIMAL as string, optional (default 0 on backend)
  whitelist?: string[]; // Array of Ethereum addresses
  status?: 0 | 1 | 2 | 3; // ProjectStatus enum
  categoryIds?: number[]; // IDs of categories to associate
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  logoUrl?: string; // URL for project logo (backend maps to 'logo' field)
  whitelist?: string[]; // Array of Ethereum addresses
  status?: 0 | 1 | 2 | 3; // ProjectStatus enum
  categoryIds?: number[]; // IDs of categories to associate
  // Note: bank is NOT modifiable here - synced from blockchain only
  // Note: progress is auto-calculated on backend
}

export interface Step {
  id: number;
  projectId: number;
  name: string; // Backend uses 'name', not 'title'
  description?: string;
  progress: number; // Auto-calculated based on tasks (0-100)
  createdAt: Date;
  updatedAt: Date;
  // Note: status/completed/order removed - progress replaces them
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

// ----------- Reward types ----------- //
export interface Reward {
  id: number;
  type: 'token' | 'nft' | 'reputation' | 'custom';
  value: string; // DECIMAL as string to preserve precision
  contractAddress?: string; // Ethereum contract address
  details?: string;
  taskId: number;
  onChain: boolean; // false = draft (editable), true = published (immutable)
  transactionHash?: string; // Blockchain tx hash (null if draft)
  blockNumber?: number; // Block number (null if draft)
  publishedAt?: string; // Publication date (null if draft)
  createdAt: string; // ISO date string
}

export interface CreateRewardRequest {
  type: 'token' | 'nft' | 'reputation' | 'custom';
  value: string;
  contractAddress?: string;
  details?: string;
  taskId: number;
}

// ----------- Task types ----------- //
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
  rewards?: Reward[]; // One-to-Many relation
  createdAt: Date;
  updatedAt?: Date;
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
  description?: string;
  image?: string; // Must be valid URL
  link?: string; // Must be valid URL
  taskOwner?: string;
  builder?: string;
  effort?: number; // 1, 2, 3, 5, 8, 13 (Fibonacci)
  dueDate?: string; // ISO date string
  status?: TaskStatus; // 0=TODO, 1=IN_PROGRESS, 2=IN_REVIEW, 3=DONE
  priority?: TaskPriority; // 1=Low, 2=Medium, 3=High
  categoryIds?: number[];
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
  type: string;
  name: string;
}

export interface CreateStepRequest {
  name: string; // Backend uses 'name'
  description?: string;
  projectId: number;
}
export interface UpdateStepRequest {
  name?: string; // Backend uses 'name'
  description?: string;
  // Note: progress is auto-calculated on backend based on tasks
}

// ----------- Column types ----------- //
export interface Column {
  id: number;
  title: string;
  color: string;
  headerColor: string;
}
