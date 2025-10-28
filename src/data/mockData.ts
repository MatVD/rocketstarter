import { Step, Project, Task, User, Category } from "../types";


export const mockCategories: Category[] = [
  { id: 1, name: "DeFi" },
  { id: 2, name: "NFT" },
  { id: 3, name: "DAO" },
  { id: 4, name: "GameFi" },
  { id: 5, name: "ERC-20" },
  { id: 6, name: "ERC-721" },
  { id: 7, name: "Staking" },
  { id: 8, name: "Marketplace" },
  { id: 9, name: "Governance" },
  { id: 10, name: "Voting" },
  { id: 11, name: "P2E" },
  { id: 12, name: "Gaming" },
];

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "My Web3 Project",
    description: "A comprehensive Web3 project with DeFi capabilities",
    progress: 75,
    owner: "Alice",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    categories: [mockCategories[0], mockCategories[4], mockCategories[6]],
  },
  {
    id: 2,
    name: "NFT Marketplace",
    description: "Decentralized marketplace for trading NFTs",
    progress: 45,
    owner: "Bob",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-10"),
    categories: [mockCategories[1], mockCategories[7], mockCategories[5]],
  },
  {
    id: 3,
    name: "DAO Governance Platform",
    description: "Decentralized autonomous organization management tool",
    progress: 20,
    owner: "Charlie",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-20"),
    categories: [mockCategories[2], mockCategories[8], mockCategories[9]],
  },
  {
    id: 4,
    name: "GameFi Platform",
    description: "Play-to-earn gaming ecosystem with NFT rewards",
    progress: 60,
    owner: "Diana",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-10"),
    categories: [mockCategories[3], mockCategories[1], mockCategories[10], mockCategories[11]],
  },
];

export const completedSteps: Step[] = [
  {
    id: 1,
    title: "Initial setup",
    description: "Basic project setup",
    status: 2,
    completed: true,
  },
  {
    id: 2,
    title: "Template selection",
    description: "ERC-20 template selection",
    status: 2,
    completed: true,
  },
  {
    id: 3,
    title: "Smart contract setup",
    description: "Loyalty token parameters",
    status: 2,
    completed: true,
  },
];

export const nextActions: Step[] = [
  {
    id: 4,
    title: "Test on testnet",
    description: "Deploy and test the contract",
    status: 1,
    completed: false,
  },
  {
    id: 5,
    title: "User interface",
    description: "Build the Web3 interface",
    status: 0,
    completed: false,
  },
];

export const flowSteps: Step[] = [
  {
    id: 1,
    title: "Requirements analysis",
    description: "Define Web3 objectives",
    status: 2,
  },
  {
    id: 2,
    title: "Architecture choice",
    description: "Select blockchain and tools",
    status: 2,
  },
  {
    id: 3,
    title: "Smart contracts",
    description: "Contract development",
    status: 1,
  },
  {
    id: 4,
    title: "Tests & audit",
    description: "Security validation",
    status: 0,
  },
  {
    id: 5,
    title: "Deployment",
    description: "Production release",
    status: 0,
  },
];

export const tasks: Task[] = [
  // Project 1 tasks (My Web3 Project)
  {
    id: 1,
    title: "Define project requirements",
    description: "Analyze and document Web3 objectives and user needs",
    status: 3, // done
    builder: "Alice Martin",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
    stepId: 1, // Requirements analysis
    projectId: 1,
    priority: 1,
  },
  {
    id: 2,
    title: "Research target audience",
    description: "Identify key user personas for the Web3 application",
    status: 0, // todo
    builder: "",
    createdAt: new Date("2025-01-12"),
    updatedAt: new Date("2025-01-12"),
    stepId: 1, // Requirements analysis
    projectId: 1,
    priority: 2,
  },
  {
    id: 4,
    title: "Choose development framework",
    description: "Select tools like Hardhat, Truffle, or Foundry",
    status: 3, // done
    builder: "David Chen",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
    stepId: 2, // Architecture choice
    projectId: 1,
    priority: 2,
  },
  {
    id: 5,
    title: "Configure ERC-20 smart contract",
    description: "Define the loyalty token parameters",
    status: 3, // done
    builder: "Alice Martin",
    createdAt: new Date("2025-01-16"),
    updatedAt: new Date("2025-01-16"),
    stepId: 3, // Smart contracts
    projectId: 1,
    priority: 1,
  },
  {
    id: 6,
    title: "Contract unit tests",
    description: "Write and execute tests to validate functionalities",
    status: 1, // in-progress
    builder: "builder-1",
    createdAt: new Date("2025-01-17"),
    updatedAt: new Date("2025-01-17"),
    stepId: 3, // Smart contracts
    projectId: 1,
    priority: 1,
  },
  {
    id: 7,
    title: "Web3 user interface",
    description: "Develop the wallet connection interface",
    status: 0, // todo
    builder: "",
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-18"),
    stepId: 3, // Smart contracts
    projectId: 1,
    priority: 1,
  },

  // Project 2 tasks (NFT Marketplace)
  {
    id: 3,
    title: "Select blockchain platform",
    description: "Choose between Ethereum, Polygon, or other platforms",
    status: 0, // todo
    builder: "",
    createdAt: new Date("2025-01-14"),
    updatedAt: new Date("2025-01-14"),
    stepId: 2, // Architecture choice
    projectId: 2,
    priority: 1,
  },
  {
    id: 13,
    title: "NFT marketplace smart contracts",
    description: "Develop ERC-721 and marketplace contracts",
    status: 1, // in-progress
    builder: "builder-2",
    createdAt: new Date("2025-01-24"),
    updatedAt: new Date("2025-01-24"),
    stepId: 3, // Smart contracts
    projectId: 2,
    priority: 2,
  },
  {
    id: 9,
    title: "Penetration testing",
    description: "Conduct security testing on the application",
    status: 1, // in-progress
    builder: "Emma Wilson",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
    stepId: 4, // Tests & audit
    projectId: 2,
    priority: 1,
  },

  // Project 3 tasks (DAO Governance Platform)
  {
    id: 8,
    title: "Security audit",
    description: "Have smart contracts audited by an expert",
    status: 1, // in-progress
    builder: "builder-1",
    createdAt: new Date("2025-01-19"),
    updatedAt: new Date("2025-01-19"),
    stepId: 4, // Tests & audit
    projectId: 3,
    priority: 1,
  },
  {
    id: 11,
    title: "Mainnet deployment",
    description: "Deploy the final version to production",
    status: 1, // in-progress
    builder: "Bob Dupont",
    createdAt: new Date("2025-01-22"),
    updatedAt: new Date("2025-01-22"),
    stepId: 5, // Deployment
    projectId: 3,
    priority: 1,
  },
  {
    id: 17,
    title: "DAO governance frontend",
    description: "Build voting interface for DAO members",
    status: 1, // in-progress
    builder: "builder-1",
    createdAt: new Date("2025-01-28"),
    updatedAt: new Date("2025-01-28"),
    stepId: 3, // Smart contracts
    projectId: 3,
    priority: 2,
  },
  {
    id: 27,
    title: "DAO treasury management",
    description: "Implement multi-signature treasury contracts",
    status: 2, // in-review
    builder: "builder-3",
    createdAt: new Date("2025-02-07"),
    updatedAt: new Date("2025-02-07"),
    stepId: 3, // Smart contracts
    projectId: 3,
    priority: 1,
  },

  // Project 4 tasks (GameFi Platform)
  {
    id: 12,
    title: "GameFi tokenomics design",
    description: "Design the game token economy and reward mechanisms",
    status: 1, // in-progress
    builder: "builder-2",
    createdAt: new Date("2025-01-23"),
    updatedAt: new Date("2025-01-23"),
    stepId: 1, // Requirements analysis
    projectId: 4,
    priority: 1,
  },
  {
    id: 18,
    title: "Game asset metadata standards",
    description: "Define NFT metadata standards for game assets",
    status: 3, // done
    builder: "Sophia Kim",
    createdAt: new Date("2025-01-29"),
    updatedAt: new Date("2025-01-29"),
    stepId: 2, // Architecture choice
    projectId: 4,
    priority: 0,
  },
  {
    id: 23,
    title: "Game balance testing",
    description: "Test game economy balance and reward distribution",
    status: 1, // in-progress
    builder: "Liam Foster",
    createdAt: new Date("2025-02-03"),
    updatedAt: new Date("2025-02-03"),
    stepId: 4, // Tests & audit
    projectId: 4,
    priority: 1,
  },

  // Additional tasks for variety
  {
    id: 36,
    title: "Smart contract optimization",
    description: "Optimize gas usage and contract efficiency",
    status: 0, // todo
    builder: "",
    createdAt: new Date("2025-02-16"),
    updatedAt: new Date("2025-02-16"),
    stepId: 3,
    projectId: 1,
    priority: 2,
  },
  {
    id: 37,
    title: "Frontend wallet integration",
    description: "Integrate multiple wallet providers",
    status: 0, // todo
    builder: "",
    createdAt: new Date("2025-02-17"),
    updatedAt: new Date("2025-02-17"),
    stepId: 3,
    projectId: 1,
    priority: 0,
  },
  {
    id: 40,
    title: "Mobile responsive design",
    description: "Ensure mobile compatibility for all features",
    status: 3, // done
    builder: "builder-3",
    createdAt: new Date("2025-02-20"),
    updatedAt: new Date("2025-02-20"),
    stepId: 3,
    projectId: 3,
    priority: 0,
  },
];

export const mockUsers: User[] = [
  {
    address: "0x1234567890123456789012345678901234567890",
    username: "Alex Thompson",
    role: "builder",
    createdAt: new Date("2024-01-01"),
  },
  {
    address: "0x2345678901234567890123456789012345678901",
    username: "Sarah Chen",
    role: "builder",
    createdAt: new Date("2024-01-02"),
  },
  {
    address: "0x3456789012345678901234567890123456789012",
    username: "Marcus Rodriguez",
    role: "builder",
    createdAt: new Date("2024-01-03"),
  },
  {
    address: "0x4567890123456789012345678901234567890123",
    username: "Alice Martin",
    role: "owner",
    createdAt: new Date("2024-01-04"),
  },
  {
    address: "0x5678901234567890123456789012345678901234",
    username: "Bob Dupont",
    role: "owner",
    createdAt: new Date("2024-01-05"),
  },
  {
    address: "0x6789012345678901234567890123456789012345",
    username: "David Chen",
    role: "owner",
    createdAt: new Date("2024-01-06"),
  },
  {
    address: "0x7890123456789012345678901234567890123456",
    username: "Emma Wilson",
    role: "owner",
    createdAt: new Date("2024-01-07"),
  },
  {
    address: "0x8901234567890123456789012345678901234567",
    username: "Liam Foster",
    role: "owner",
    createdAt: new Date("2024-01-08"),
  },
  {
    address: "0x9012345678901234567890123456789012345678",
    username: "Sophia Kim",
    role: "owner",
    createdAt: new Date("2024-01-09"),
  },
];
