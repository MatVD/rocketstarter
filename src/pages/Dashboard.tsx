import { motion } from "framer-motion";
import DataBoundary from "../components/UI/DataBoundary";
import ProjectProgress from "../components/Dashboard/ProjectProgress";
import StepByStep from "../components/Dashboard/StepByStep";
import { useProjectStoretore } from "../store/project.store";

export default function Dashboard() {
  const { projects, projectsLoading, projectsError } = useProjectStoretore();
  const project = projects[0]; // First project for demo

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
        isLoading={projectsLoading}
        error={projectsError}
        isEmpty={!project}
        dataType="projects"
      >
        <div className="flex flex-col gap-4">
          {/* Project progress */}
          <ProjectProgress project={project} />

          {/* Step by step journey */}
          <StepByStep />
        </div>
      </DataBoundary>
    </div>
  );
}
