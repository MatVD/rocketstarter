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
  progress: number;
  environment: "testnet" | "mainnet";
  owner?: string;
  createdAt?: string;
  tags?: string[];
}

export interface User {
  id: string;
  address?: string;
  role: "owner" | "builder";
  name?: string;
  isConnected: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // Accept any column id
  assignee: string;
  createdAt: string;
  stepId: string; // Associate task with a specific step
  projectId: string; // Associate task with a specific project
}

export interface Column {
  id: string;
  title: string;
  color: string;
  headerColor: string;
}
