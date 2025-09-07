import { Step, Template, Project, Task } from "../types";

export const mockProject: Project = {
  name: "My Web3 Project",
  progress: 65,
  environment: "testnet",
};

export const completedSteps: Step[] = [
  {
    id: "1",
    title: "Initial setup",
    description: "Basic project setup",
    status: "completed",
    completed: true,
  },
  {
    id: "2",
    title: "Template selection",
    description: "ERC-20 template selection",
    status: "completed",
    completed: true,
  },
  {
    id: "3",
    title: "Smart contract setup",
    description: "Loyalty token parameters",
    status: "completed",
    completed: true,
  },
];

export const nextActions: Step[] = [
  {
    id: "4",
    title: "Test on testnet",
    description: "Deploy and test the contract",
    status: "in-progress",
    completed: false,
  },
  {
    id: "5",
    title: "User interface",
    description: "Build the Web3 interface",
    status: "todo",
    completed: false,
  },
];

export const flowSteps: Step[] = [
  {
    id: "1",
    title: "Requirements analysis",
    description: "Define Web3 objectives",
    status: "completed",
  },
  {
    id: "2",
    title: "Architecture choice",
    description: "Select blockchain and tools",
    status: "completed",
  },
  {
    id: "3",
    title: "Smart contracts",
    description: "Contract development",
    status: "in-progress",
  },
  {
    id: "4",
    title: "Tests & audit",
    description: "Security validation",
    status: "todo",
  },
  {
    id: "5",
    title: "Deployment",
    description: "Production release",
    status: "todo",
  },
];

export const templates: Template[] = [
  {
    id: "1",
    title: "Loyalty ERC-20",
    description:
      "Loyalty token to reward your customers with redeemable points",
    icon: "coins",
    difficulty: "Beginner",
  },
  {
    id: "2",
    title: "Simple NFT drop",
    description: "NFT collection with public mint, whitelist and IPFS metadata",
    icon: "image",
    difficulty: "Intermediate",
  },
  {
    id: "3",
    title: "DAO + multi-sig treasury",
    description:
      "Decentralized organization with governance and secure treasury",
    icon: "users",
    difficulty: "Advanced",
  },
];

export const tasks: Task[] = [
  {
    id: "1",
    title: "Define project requirements",
    description: "Analyze and document Web3 objectives and user needs",
    status: "done",
    assignee: "Alice Martin",
    createdAt: "2025-01-10",
    stepId: "1", // Requirements analysis
  },
  {
    id: "2",
    title: "Research target audience",
    description: "Identify key user personas for the Web3 application",
    status: "done",
    assignee: "Bob Dupont",
    createdAt: "2025-01-12",
    stepId: "1", // Requirements analysis
  },
  {
    id: "3",
    title: "Select blockchain platform",
    description: "Choose between Ethereum, Polygon, or other platforms",
    status: "done",
    assignee: "Claire Rousseau",
    createdAt: "2025-01-14",
    stepId: "2", // Architecture choice
  },
  {
    id: "4",
    title: "Choose development framework",
    description: "Select tools like Hardhat, Truffle, or Foundry",
    status: "done",
    assignee: "David Chen",
    createdAt: "2025-01-15",
    stepId: "2", // Architecture choice
  },
  {
    id: "5",
    title: "Configure ERC-20 smart contract",
    description: "Define the loyalty token parameters",
    status: "done",
    assignee: "Alice Martin",
    createdAt: "2025-01-16",
    stepId: "3", // Smart contracts
  },
  {
    id: "6",
    title: "Contract unit tests",
    description: "Write and execute tests to validate functionalities",
    status: "in-progress",
    assignee: "Bob Dupont",
    createdAt: "2025-01-17",
    stepId: "3", // Smart contracts
  },
  {
    id: "7",
    title: "Web3 user interface",
    description: "Develop the wallet connection interface",
    status: "in-progress",
    assignee: "Claire Rousseau",
    createdAt: "2025-01-18",
    stepId: "3", // Smart contracts
  },
  {
    id: "8",
    title: "Security audit",
    description: "Have smart contracts audited by an expert",
    status: "todo",
    assignee: "David Chen",
    createdAt: "2025-01-19",
    stepId: "4", // Tests & audit
  },
  {
    id: "9",
    title: "Penetration testing",
    description: "Conduct security testing on the application",
    status: "todo",
    assignee: "Emma Wilson",
    createdAt: "2025-01-20",
    stepId: "4", // Tests & audit
  },
  {
    id: "10",
    title: "Testnet deployment",
    description: "Deploy and test on the test network",
    status: "todo",
    assignee: "Alice Martin",
    createdAt: "2025-01-21",
    stepId: "5", // Deployment
  },
  {
    id: "11",
    title: "Mainnet deployment",
    description: "Deploy the final version to production",
    status: "todo",
    assignee: "Bob Dupont",
    createdAt: "2025-01-22",
    stepId: "5", // Deployment
  },
];
