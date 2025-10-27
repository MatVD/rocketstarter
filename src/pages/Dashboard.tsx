import { motion } from "framer-motion";
import { Route } from "lucide-react";
import Card from "../components/UI/Card";
import FlowStep from "../components/Flow/FlowStep";
import { flowSteps } from "../data/mockData";
import { useProjects } from "../hooks/useProjects";
import DataBoundary from "../components/UI/DataBoundary";
import ProjectProgress from "../components/Dashboard/ProjectProgress";

interface DashboardProps {
  onNavigateToStep: (stepId: number) => void;
}

export default function Dashboard({ onNavigateToStep }: DashboardProps) {
  const { projects, loading, error } = useProjects();
  const project = projects[0]; // First project for demo

  const handleStepDetails = (stepId: number) => {
    onNavigateToStep(stepId);
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

      <DataBoundary
        isLoading={loading}
        error={error}
        isEmpty={!project}
        dataType="projects"
      >
        <div className="flex flex-col gap-4">
          {/* Project progress */}
          <ProjectProgress project={project} />

          {/* Step by step journey */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Route className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Step by step
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visualize your progress - Click "View details" to manage
                    tasks for each step
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-8 overflow-x-auto">
                <div className="flex items-center space-x-0 min-w-max">
                  {flowSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <FlowStep
                        step={step}
                        isLast={index === flowSteps.length - 1}
                        onDetails={handleStepDetails}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
              >
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Current step: Smart contracts
                </h4>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  You are currently developing smart contracts for your project.
                  This step includes creating, testing and optimizing your
                  contracts.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue step
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View documentation
                  </motion.button>
                </div>
              </motion.div> */}
            </Card>
          </motion.div>
        </div>
      </DataBoundary>
    </div>
  );
}
