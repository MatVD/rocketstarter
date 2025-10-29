import { motion } from "framer-motion";
import { useProjectStore } from "../store/project.store";
import DataBoundary from "../components/UI/DataBoundary";
import { useEffect } from "react";
import ProjectCard from "../components/Project/ProjectCard";

export default function ProjectList() {
  const { projects, projectsLoading, projectsError, fetchProjects } =
    useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Available Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Choose a project to start building
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <DataBoundary
        isLoading={projectsLoading}
        error={projectsError}
        isEmpty={projects.length === 0}
        dataType="projects"
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
