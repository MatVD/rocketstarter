import { useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import DataBoundary from "../components/UI/DataBoundary";
import ProjectProgress from "../components/Dashboard/ProjectProgress";
import StepByStep from "../components/Dashboard/StepByStep";
import ProjectMetrics from "../components/Dashboard/ProjectMetrics";
import { useProjectStore } from "../store/project.store";
import { useTaskStore } from "../store/task.store";
import { useUserStore } from "../store";

export default function Dashboard() {
  const {
    projects,
    projectsLoading,
    projectsError,
    selectedProject,
    setSelectedProject,
    fetchProjectsByOwner,
  } = useProjectStore();
  const { user } = useUserStore();
  const { tasks, fetchTasks, tasksLoading } = useTaskStore();

  // Fetch projects on mount
  useEffect(() => {
    fetchProjectsByOwner(user?.address || "");
  }, [fetchProjectsByOwner, user?.address]);

  // Set default project if none selected
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject, setSelectedProject]);

  // Fetch tasks when selected project changes
  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject.id.toString());
    }
  }, [selectedProject, fetchTasks]);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <select
              value={selectedProject?.id || ""}
              onChange={(e) => {
                const project = projects.find(
                  (p) => p.id === parseInt(e.target.value)
                );
                if (project) setSelectedProject(project);
              }}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm cursor-pointer min-w-[200px]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </motion.div>
        )}
      </div>

      <DataBoundary
        isLoading={projectsLoading}
        error={projectsError}
        isEmpty={!selectedProject}
        dataType="projects"
      >
        {selectedProject && (
          <div className="flex flex-col gap-4">
            {/* Project Metrics */}
            <ProjectMetrics
              project={selectedProject}
              tasks={tasks}
              loading={tasksLoading}
            />

            {/* Project progress */}
            <ProjectProgress project={selectedProject} />

            {/* Step by step journey */}
            <StepByStep />
          </div>
        )}
      </DataBoundary>
    </div>
  );
}
