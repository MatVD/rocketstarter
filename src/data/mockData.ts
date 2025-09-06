import { Step, Template, Project } from "../types";

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
