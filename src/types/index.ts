export interface Step {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  completed?: boolean;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Project {
  name: string;
  progress: number;
  environment: 'testnet' | 'mainnet';
}