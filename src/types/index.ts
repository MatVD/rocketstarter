export interface Step {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  completed?: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  steps?: Step[]; // Optional pre-built steps for strategy templates
}

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

export interface User {
  id: string;
  address?: string;
  walletAddress?: string;
  role: "owner" | "builder";
  name?: string;
  email?: string;
  isConnected: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string; // Accept any column id or backend status numbers
  assignee?: string;
  builderAddress?: string;
  createdAt?: string;
  updatedAt?: string;
  stepId: string; // Associate task with a specific step
  projectId: string; // Associate task with a specific project
  priority?: 0 | 1 | 2 | 3; // Task priority level (string or number)
  categories?: string[]; // Task categories
}

export interface Column {
  id: string;
  title: string;
  color: string;
  headerColor: string;
}

// Backend-specific types for API responses
export interface ApiProject extends Omit<Project, "id"> {
  id: number;
}

export interface ApiTask
  extends Omit<Task, "id" | "projectId" | "status" | "priority"> {
  id: number;
  projectId: number;
  status: 0 | 1 | 2 | 3; // 0=todo, 1=inprogress, 2=inreview, 3=done
  priority: 0 | 1 | 2 | 3; // 0=low, 1=medium, 2=high, 3=urgent
}

export interface ApiUser extends Omit<User, "id"> {
  id: number;
}
