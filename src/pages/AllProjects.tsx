import { motion } from "framer-motion";
import { useProjectStore } from "../store/project.store";
import DataBoundary from "../components/UI/DataBoundary";
import ProjectCard from "../components/Project/ProjectCard";
import { FolderOpen } from "lucide-react";

export default function AllProjects() {
  // Simply use data from store - loaded globally in AppLayout
  const { projects, projectsLoading, projectsError } = useProjectStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-10 lg:p-12 space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                All Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Browse all available Web3 projects
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <DataBoundary
        isEmpty={projects.length === 0}
        isLoading={projectsLoading}
        error={projectsError}
        dataType="projects"
        emptyMessage="No projects available yet."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </DataBoundary>
    </motion.div>
  );
}
