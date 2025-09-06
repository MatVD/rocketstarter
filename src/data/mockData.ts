import { Step, Template, Project } from '../types';

export const mockProject: Project = {
  name: "My Web3 Project",
  progress: 65,
  environment: 'testnet'
};

export const completedSteps: Step[] = [
  {
    id: '1',
    title: 'Initial Setup',
    description: 'Basic project configuration',
    status: 'completed',
    completed: true
  },
  {
    id: '2',
    title: 'Template Selection',
    description: 'ERC-20 template selection',
    status: 'completed',
    completed: true
  },
  {
    id: '3',
    title: 'Smart Contract Configuration',
    description: 'Loyalty token parameters',
    status: 'completed',
    completed: true
  }
];

export const nextActions: Step[] = [
  {
    id: '4',
    title: 'Testnet Testing',
    description: 'Contract deployment and testing',
    status: 'in-progress',
    completed: false
  },
  {
    id: '5',
    title: 'User Interface',
    description: 'Web3 interface creation',
    status: 'todo',
    completed: false
  }
];

export const flowSteps: Step[] = [
  {
    id: '1',
    title: 'Requirements Analysis',
    description: 'Define Web3 objectives',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Architecture Choice',
    description: 'Select blockchain and tools',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Smart Contracts',
    description: 'Contract development',
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'Testing & Audit',
    description: 'Security validation',
    status: 'todo'
  },
  {
    id: '5',
    title: 'Deployment',
    description: 'Production release',
    status: 'todo'
  }
];

export const templates: Template[] = [
  {
    id: '1',
    title: 'ERC-20 Loyalty',
    description: 'Loyalty token to reward your customers with exchangeable points',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Simple NFT Drop',
    description: 'NFT collection with public mint, whitelist and IPFS metadata',
    difficulty: 'Intermediate'
  },
  {
    id: '3',
    title: 'DAO + Multi-sig Treasury',
    description: 'Decentralized organization with governance and secure treasury',
    difficulty: 'Advanced'
  }
];