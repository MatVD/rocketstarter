import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Circle,
  Target,
  Users,
  Calendar,
} from "lucide-react";
import { Step } from "../../types";

interface StepDetailsProps {
  step: Step;
}

export default function StepDetails({ step }: StepDetailsProps) {
  const getStatusIcon = () => {
    switch (step.status) {
      case "completed":
        return (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      case "in-progress":
        return (
          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        );
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepGuidelines = () => {
    switch (step.id) {
      case "1":
        return {
          objective:
            "Define clear Web3 project requirements and success metrics",
          tasks: [
            "Identify target blockchain",
            "Define user stories",
            "Set project timeline",
          ],
          team: "Business Analyst, Product Manager",
          duration: "1-2 weeks",
        };
      case "2":
        return {
          objective: "Select optimal blockchain and development tools",
          tasks: [
            "Choose blockchain platform",
            "Select development framework",
            "Set up development environment",
          ],
          team: "Technical Lead, DevOps Engineer",
          duration: "3-5 days",
        };
      case "3":
        return {
          objective: "Develop, test and optimize smart contracts",
          tasks: [
            "Write smart contracts",
            "Unit testing",
            "Security audit",
            "Gas optimization",
          ],
          team: "Smart Contract Developer, Security Engineer",
          duration: "2-4 weeks",
        };
      case "4":
        return {
          objective: "Comprehensive testing and security validation",
          tasks: [
            "Integration testing",
            "Security audit",
            "Performance testing",
            "User acceptance testing",
          ],
          team: "QA Engineer, Security Auditor",
          duration: "1-2 weeks",
        };
      case "5":
        return {
          objective: "Deploy to production environment",
          tasks: [
            "Mainnet deployment",
            "Frontend integration",
            "Documentation",
            "Monitoring setup",
          ],
          team: "DevOps Engineer, Frontend Developer",
          duration: "3-7 days",
        };
      default:
        return {
          objective: "Complete this step according to project requirements",
          tasks: ["Task 1", "Task 2", "Task 3"],
          team: "Development Team",
          duration: "1 week",
        };
    }
  };

  const guidelines = getStepGuidelines();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
    >
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">{getStatusIcon()}</div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {step.description}
          </p>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              step.status === "completed"
                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                : step.status === "in-progress"
                ? "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            }`}
          >
            {step.status === "completed"
              ? "Completed"
              : step.status === "in-progress"
              ? "In Progress"
              : "To Do"}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Objective
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {guidelines.objective}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Key Tasks
            </h4>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {guidelines.tasks.map((task, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Team
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {guidelines.team}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Duration
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {guidelines.duration}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
