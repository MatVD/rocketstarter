import { motion } from "framer-motion";

import { useProjects } from "../hooks/useProjects";
import DataBoundary from "../components/UI/DataBoundary";
import ProjectProgress from "../components/Dashboard/ProjectProgress";
import StepByStep from "../components/Dashboard/StepByStep";

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
          <StepByStep handleStepDetails={handleStepDetails} />
        </div>
      </DataBoundary>
    </div>
  );
}
