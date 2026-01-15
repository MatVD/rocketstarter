import { motion } from "framer-motion";
import { useProjectStore } from "../store/project.store";
import { useTaskStore } from "../store/task.store";
import DataBoundary from "../components/UI/DataBoundary";
import { useMemo } from "react";
import ProjectCard from "../components/Project/ProjectCard";
import { useUserStore } from "../store";
import { Plus, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyProjects() {
  const { user, userLoading } = useUserStore();
  const navigate = useNavigate();
  
  // Simply use data from store - loaded globally in AppLayout
  const {
    projects,
    projectsLoading,
    projectsError,
  } = useProjectStore();
  
  const { tasks, tasksLoading } = useTaskStore();

  // Calculate assigned tasks (tasks where user is the builder)
  const assignedTasks = useMemo(() => {
    if (!user) return [];
    return tasks.filter((t) => t.builder === user.address);
  }, [tasks, user]);

  // Filter projects: show projects where user is owner OR has assigned tasks
  const myProjects = useMemo(() => {
    if (!user) return [];

    // Normalize addresses to lowercase for comparison (backend stores lowercase)
    const userAddressLower = user.address.toLowerCase();

    // Projects where user is owner
    const ownedProjects = projects.filter((p) => p.owner.toLowerCase() === userAddressLower);
    
    // Projects where user has assigned tasks
    const assignedProjectIds = Array.from(new Set(assignedTasks.map((t) => t.projectId)));
    const assignedProjects = projects.filter((p) => assignedProjectIds.includes(p.id));
    
    // Merge both lists (remove duplicates by using Set with project IDs)
    const allProjectIds = new Set([
      ...ownedProjects.map((p) => p.id),
      ...assignedProjects.map((p) => p.id)
    ]);
    
    return projects.filter((p) => allProjectIds.has(p.id));
  }, [user, projects, assignedTasks]);

  // Combined loading state: wait for user AND (projects OR tasks)
  const isLoading = userLoading || projectsLoading || tasksLoading;

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
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Projects you own or contribute to as a builder
              </p>
            </div>
          </div>
          {user?.role === "Owner" && (
            <motion.button
              onClick={() => navigate("/projects/new")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              New Project
            </motion.button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <DataBoundary
        isEmpty={myProjects.length === 0 && !isLoading}
        isLoading={isLoading}
        error={projectsError}
        dataType="projects"
        emptyMessage="No projects yet. Create a project or get assigned to tasks to see them here!"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </DataBoundary>
    </motion.div>
  );
}
