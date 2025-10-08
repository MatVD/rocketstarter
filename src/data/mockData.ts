import { Step, Project, Task, User } from "../types";


export const mockProjects: Project[] = [
  {
    id: "1",
    name: "My Web3 Project",
    description: "A comprehensive Web3 project with DeFi capabilities",
    progress: 75,
    environment: "testnet",
    owner: "Alice",
    createdAt: "2024-01-15",
    categories: ["DeFi", "ERC-20", "Staking"],
  },
  {
    id: "2",
    name: "NFT Marketplace",
    description: "Decentralized marketplace for trading NFTs",
    progress: 45,
    environment: "testnet",
    owner: "Bob",
    createdAt: "2024-02-01",
    categories: ["NFT", "Marketplace", "ERC-721"],
  },
  {
    id: "3",
    name: "DAO Governance Platform",
    description: "Decentralized autonomous organization management tool",
    progress: 20,
    environment: "mainnet",
    owner: "Charlie",
    createdAt: "2024-02-15",
    categories: ["DAO", "Governance", "Voting"],
  },
  {
    id: "4",
    name: "GameFi Platform",
    description: "Play-to-earn gaming ecosystem with NFT rewards",
    progress: 60,
    environment: "testnet",
    owner: "Diana",
    createdAt: "2024-03-01",
    categories: ["GameFi", "NFT", "P2E", "Gaming"],
  },
];

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

export const tasks: Task[] = [
  // Project 1 tasks (My Web3 Project)
  {
    id: "1",
    title: "Define project requirements",
    description: "Analyze and document Web3 objectives and user needs",
    status: "done",
    assignee: "Alice Martin",
    createdAt: "2025-01-10",
    stepId: "1", // Requirements analysis
    projectId: "1",
    priority: 1,
  },
  {
    id: "2",
    title: "Research target audience",
    description: "Identify key user personas for the Web3 application",
    status: "todo",
    assignee: "",
    createdAt: "2025-01-12",
    stepId: "1", // Requirements analysis
    projectId: "1",
    priority: 2,
  },
  {
    id: "4",
    title: "Choose development framework",
    description: "Select tools like Hardhat, Truffle, or Foundry",
    status: "done",
    assignee: "David Chen",
    createdAt: "2025-01-15",
    stepId: "2", // Architecture choice
    projectId: "1",
    priority: 2,
  },
  {
    id: "5",
    title: "Configure ERC-20 smart contract",
    description: "Define the loyalty token parameters",
    status: "done",
    assignee: "Alice Martin",
    createdAt: "2025-01-16",
    stepId: "3", // Smart contracts
    projectId: "1",
    priority: 1,
  },
  {
    id: "6",
    title: "Contract unit tests",
    description: "Write and execute tests to validate functionalities",
    status: "in-progress",
    assignee: "builder-1",
    createdAt: "2025-01-17",
    stepId: "3", // Smart contracts
    projectId: "1",
    priority: 1,
  },
  {
    id: "7",
    title: "Web3 user interface",
    description: "Develop the wallet connection interface",
    status: "todo",
    assignee: "",
    createdAt: "2025-01-18",
    stepId: "3", // Smart contracts
    projectId: "1",
    priority: 1,
  },

  // Project 2 tasks (NFT Marketplace)
  {
    id: "3",
    title: "Select blockchain platform",
    description: "Choose between Ethereum, Polygon, or other platforms",
    status: "todo",
    assignee: "",
    createdAt: "2025-01-14",
    stepId: "2", // Architecture choice
    projectId: "2",
    priority: 1,
  },
  {
    id: "13",
    title: "NFT marketplace smart contracts",
    description: "Develop ERC-721 and marketplace contracts",
    status: "in-progress",
    assignee: "builder-2",
    createdAt: "2025-01-24",
    stepId: "3", // Smart contracts
    projectId: "2",
    priority: 2,
  },
  {
    id: "9",
    title: "Penetration testing",
    description: "Conduct security testing on the application",
    status: "in-progress",
    assignee: "Emma Wilson",
    createdAt: "2025-01-20",
    stepId: "4", // Tests & audit
    projectId: "2",
    priority: 1,
  },

  // Project 3 tasks (DAO Governance Platform)
  {
    id: "8",
    title: "Security audit",
    description: "Have smart contracts audited by an expert",
    status: "in-progress",
    assignee: "builder-1",
    createdAt: "2025-01-19",
    stepId: "4", // Tests & audit
    projectId: "3",
    priority: 1,
  },
  {
    id: "11",
    title: "Mainnet deployment",
    description: "Deploy the final version to production",
    status: "in-progress",
    assignee: "Bob Dupont",
    createdAt: "2025-01-22",
    stepId: "5", // Deployment
    projectId: "3",
    priority: 1,
  },
  {
    id: "17",
    title: "DAO governance frontend",
    description: "Build voting interface for DAO members",
    status: "in-progress",
    assignee: "builder-1",
    createdAt: "2025-01-28",
    stepId: "3", // Smart contracts
    projectId: "3",
    priority: 2,
  },
  {
    id: "27",
    title: "DAO treasury management",
    description: "Implement multi-signature treasury contracts",
    status: "in-review",
    assignee: "builder-3",
    createdAt: "2025-02-07",
    stepId: "3", // Smart contracts
    projectId: "3",
    priority: 1,
  },

  // Project 4 tasks (GameFi Platform)
  {
    id: "12",
    title: "GameFi tokenomics design",
    description: "Design the game token economy and reward mechanisms",
    status: "in-progress",
    assignee: "builder-2",
    createdAt: "2025-01-23",
    stepId: "1", // Requirements analysis
    projectId: "4",
    priority: 1,
  },
  {
    id: "18",
    title: "Game asset metadata standards",
    description: "Define NFT metadata standards for game assets",
    status: "done",
    assignee: "Sophia Kim",
    createdAt: "2025-01-29",
    stepId: "2", // Architecture choice
    projectId: "4",
    priority: 3,
  },
  {
    id: "23",
    title: "Game balance testing",
    description: "Test game economy balance and reward distribution",
    status: "in-progress",
    assignee: "Liam Foster",
    createdAt: "2025-02-03",
    stepId: "4", // Tests & audit
    projectId: "4",
    priority: 1,
  },

  // Additional tasks for variety
  {
    id: "36",
    title: "Smart contract optimization",
    description: "Optimize gas usage and contract efficiency",
    status: "todo",
    assignee: "",
    createdAt: "2025-02-16",
    stepId: "3",
    projectId: "1",
    priority: 2,
  },
  {
    id: "37",
    title: "Frontend wallet integration",
    description: "Integrate multiple wallet providers",
    status: "todo",
    assignee: "",
    createdAt: "2025-02-17",
    stepId: "3",
    projectId: "1",
    priority: 3,
  },
  {
    id: "40",
    title: "Mobile responsive design",
    description: "Ensure mobile compatibility for all features",
    status: "done",
    assignee: "builder-3",
    createdAt: "2025-02-20",
    stepId: "3",
    projectId: "3",
    priority: 3,
  },
];

export const mockUsers: User[] = [
  {
    id: "builder-1",
    name: "Alex Thompson",
    role: "builder",
    isConnected: true,
    address: "0x1234567890123456789012345678901234567890",
  },
  {
    id: "builder-2",
    name: "Sarah Chen",
    role: "builder",
    isConnected: true,
    address: "0x2345678901234567890123456789012345678901",
  },
  {
    id: "builder-3",
    name: "Marcus Rodriguez",
    role: "builder",
    isConnected: false,
    address: "0x3456789012345678901234567890123456789012",
  },
  {
    id: "Alice Martin",
    name: "Alice Martin",
    role: "owner",
    isConnected: false,
  },
  {
    id: "Bob Dupont",
    name: "Bob Dupont",
    role: "owner",
    isConnected: false,
  },
  {
    id: "David Chen",
    name: "David Chen",
    role: "owner",
    isConnected: false,
  },
  {
    id: "Emma Wilson",
    name: "Emma Wilson",
    role: "owner",
    isConnected: false,
  },
  {
    id: "Liam Foster",
    name: "Liam Foster",
    role: "owner",
    isConnected: true,
    address: "0x5678901234567890123456789012345678901234",
  },
  {
    id: "Sophia Kim",
    name: "Sophia Kim",
    role: "owner",
    isConnected: false,
  },
];
