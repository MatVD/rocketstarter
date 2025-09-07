import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, Clock } from "lucide-react";
import Card from "../components/UI/Card";
import ProgressBar from "../components/UI/ProgressBar";
import StepCard from "../components/Dashboard/StepCard";
import { mockProject, completedSteps, nextActions } from "../data/mockData";

export default function Dashboard() {
  const [actions, setActions] = useState(nextActions);

  const handleCompleteAction = (stepId: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === stepId
          ? { ...action, status: "completed" as const, completed: true }
          : action
      )
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track the progress of your Web3 transition
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Project progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Project progress
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Overall progress
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockProject.progress}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  3/5 steps
                </span>
              </div>
              <ProgressBar progress={mockProject.progress} />
            </div>
          </Card>
        </motion.div>

        {/* Recent completed steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent completed steps
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Steps recently finished
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {completedSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <StepCard step={step} />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Next actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Next actions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Steps to complete
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <StepCard
                    step={action}
                    showButton
                    onComplete={handleCompleteAction}
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
