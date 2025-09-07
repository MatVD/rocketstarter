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
}

export interface Project {
  name: string;
  progress: number;
  environment: "testnet" | "mainnet";
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // Accept any column id
  assignee: string;
  createdAt: string;
}
