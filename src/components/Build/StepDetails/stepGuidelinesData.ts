export interface StepGuideline {
  objective: string;
  tasks: string[];
  team: string;
  duration: string;
}

export const getStepGuidelines = (stepId: string): StepGuideline => {
  const guidelines: Record<string, StepGuideline> = {
    "1": {
      objective: "Define clear Web3 project requirements and success metrics",
      tasks: [
        "Identify target blockchain",
        "Define user stories",
        "Set project timeline",
      ],
      team: "Business Analyst, Product Manager",
      duration: "1-2 weeks",
    },
    "2": {
      objective: "Select optimal blockchain and development tools",
      tasks: [
        "Choose blockchain platform",
        "Select development framework",
        "Set up development environment",
      ],
      team: "Technical Lead, DevOps Engineer",
      duration: "3-5 days",
    },
    "3": {
      objective: "Develop, test and optimize smart contracts",
      tasks: [
        "Write smart contracts",
        "Unit testing",
        "Security audit",
        "Gas optimization",
      ],
      team: "Smart Contract Developer, Security Engineer",
      duration: "2-4 weeks",
    },
    "4": {
      objective: "Comprehensive testing and security validation",
      tasks: [
        "Integration testing",
        "Security audit",
        "Performance testing",
        "User acceptance testing",
      ],
      team: "QA Engineer, Security Auditor",
      duration: "1-2 weeks",
    },
    "5": {
      objective: "Deploy to production environment",
      tasks: [
        "Mainnet deployment",
        "Frontend integration",
        "Documentation",
        "Monitoring setup",
      ],
      team: "DevOps Engineer, Frontend Developer",
      duration: "3-7 days",
    },
  };

  return (
    guidelines[stepId] || {
      objective: "Complete this step according to project requirements",
      tasks: ["Task 1", "Task 2", "Task 3"],
      team: "Development Team",
      duration: "1 week",
    }
  );
};
