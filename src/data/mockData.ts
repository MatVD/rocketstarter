import { Step, Template, Project, Task, User } from "../types";

export const mockProject: Project = {
  id: "1",
  name: "My Web3 Project",
  description: "A comprehensive Web3 project with DeFi capabilities",
  progress: 65,
  environment: "testnet",
  owner: "0x1234567890123456789012345678901234567890",
  createdAt: "2024-01-15",
  tags: ["DeFi", "ERC-20", "Staking"],
};

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "My Web3 Project",
    description: "A comprehensive Web3 project with DeFi capabilities",
    progress: 65,
    environment: "testnet",
    owner: "0x1234567890123456789012345678901234567890",
    createdAt: "2024-01-15",
    tags: ["DeFi", "ERC-20", "Staking"],
  },
  {
    id: "2",
    name: "NFT Marketplace",
    description: "Decentralized marketplace for trading NFTs",
    progress: 40,
    environment: "testnet",
    owner: "0x2345678901234567890123456789012345678901",
    createdAt: "2024-02-01",
    tags: ["NFT", "Marketplace", "ERC-721"],
  },
  {
    id: "3",
    name: "DAO Governance Platform",
    description: "Decentralized autonomous organization management tool",
    progress: 80,
    environment: "mainnet",
    owner: "0x3456789012345678901234567890123456789012",
    createdAt: "2024-01-10",
    tags: ["DAO", "Governance", "Voting"],
  },
  {
    id: "4",
    name: "Cross-chain Bridge",
    description: "Secure asset transfer between different blockchains",
    progress: 25,
    environment: "testnet",
    owner: "0x4567890123456789012345678901234567890123",
    createdAt: "2024-02-20",
    tags: ["Bridge", "Cross-chain", "Security"],
  },
];

export const mockUser: User = {
  id: "builder-1",
  address: "0x9876543210987654321098765432109876543210",
  role: "builder",
  name: "Builder User",
  isConnected: false,
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
    title: "DeFi Protocol Launch",
    description:
      "Complete strategy for launching a decentralized finance protocol with smart contracts, frontend, and testing",
    icon: "coins",
    difficulty: "Advanced",
    steps: [
      {
        id: "defi-1",
        title: "Smart Contract Development",
        description: "Develop and audit smart contracts for the DeFi protocol",
        status: "todo",
        completed: false,
      },
      {
        id: "defi-2",
        title: "Frontend Integration",
        description: "Build user interface for protocol interaction",
        status: "todo",
        completed: false,
      },
      {
        id: "defi-3",
        title: "Security Audit",
        description: "Conduct comprehensive security audit",
        status: "todo",
        completed: false,
      },
      {
        id: "defi-4",
        title: "Testnet Deployment",
        description: "Deploy and test on testnet",
        status: "todo",
        completed: false,
      },
      {
        id: "defi-5",
        title: "Mainnet Launch",
        description: "Deploy to mainnet and monitor",
        status: "todo",
        completed: false,
      },
    ],
  },
  {
    id: "2",
    title: "NFT Marketplace",
    description:
      "Strategy for building a complete NFT marketplace with minting, trading, and royalties",
    icon: "image",
    difficulty: "Intermediate",
    steps: [
      {
        id: "nft-1",
        title: "NFT Smart Contract",
        description: "Create ERC721 contract with royalties",
        status: "todo",
        completed: false,
      },
      {
        id: "nft-2",
        title: "Marketplace Contract",
        description: "Build marketplace smart contract for trading",
        status: "todo",
        completed: false,
      },
      {
        id: "nft-3",
        title: "Frontend Development",
        description: "Create marketplace interface",
        status: "todo",
        completed: false,
      },
      {
        id: "nft-4",
        title: "IPFS Integration",
        description: "Set up metadata storage on IPFS",
        status: "todo",
        completed: false,
      },
      {
        id: "nft-5",
        title: "Testing & Launch",
        description: "Test all features and deploy",
        status: "todo",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    title: "DAO Governance Platform",
    description:
      "Complete strategy for launching a DAO with voting, treasury management, and member onboarding",
    icon: "users",
    difficulty: "Advanced",
    steps: [
      {
        id: "dao-1",
        title: "Governance Token",
        description: "Deploy ERC20 governance token",
        status: "todo",
        completed: false,
      },
      {
        id: "dao-2",
        title: "Voting Mechanism",
        description: "Implement voting smart contracts",
        status: "todo",
        completed: false,
      },
      {
        id: "dao-3",
        title: "Treasury Setup",
        description: "Create multi-sig treasury",
        status: "todo",
        completed: false,
      },
      {
        id: "dao-4",
        title: "Member Portal",
        description: "Build member dashboard and voting interface",
        status: "todo",
        completed: false,
      },
      {
        id: "dao-5",
        title: "Community Launch",
        description: "Onboard members and start governance",
        status: "todo",
        completed: false,
      },
    ],
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
    assignee: "builder-1",
    createdAt: "2025-01-17",
    stepId: "3", // Smart contracts
  },
  {
    id: "7",
    title: "Web3 user interface",
    description: "Develop the wallet connection interface",
    status: "todo",
    assignee: "builder-1",
    createdAt: "2025-01-18",
    stepId: "3", // Smart contracts
  },
  {
    id: "8",
    title: "Security audit",
    description: "Have smart contracts audited by an expert",
    status: "todo",
    assignee: "builder-1",
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
    assignee: "builder-1",
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

export const mockUsers: User[] = [
  {
    id: "builder-1",
    name: "Alex Thompson",
    role: "builder",
    isConnected: true,
    address: "0x1234567890123456789012345678901234567890",
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
    id: "Claire Rousseau",
    name: "Claire Rousseau",
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
];
