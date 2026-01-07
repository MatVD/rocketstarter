import { motion } from "framer-motion";
import { useProjectStore } from "../store/project.store";
import DataBoundary from "../components/UI/DataBoundary";
import { useEffect } from "react";
import ProjectCard from "../components/Project/ProjectCard";
import { useUserStore } from "../store";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OwnerProjectsList() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const {
    projects,
    projectsLoading,
    projectsError,
    fetchProjectsByOwner,
    setSelectedProject,
  } = useProjectStore();

  useEffect(() => {
    if (user?.address) {
      fetchProjectsByOwner(user.address);
    }
  }, [fetchProjectsByOwner, user?.address]);

  const handleProjectClick = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      navigate("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-10 lg:p-12 space-y-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage and track your Web3 project portfolio
            </p>
          </div>
          <motion.button
            onClick={() => navigate("/owner/projects/new")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            New Project
          </motion.button>
        </div>
      </div>

      {/* Projects Grid */}
      <DataBoundary
        isEmpty={projects.length === 0}
        isLoading={projectsLoading}
        error={projectsError}
        dataType="projects"
        emptyMessage="No projects yet. Create your first project to get started!"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
            >
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
      </DataBoundary>
    </motion.div>
  );
}
