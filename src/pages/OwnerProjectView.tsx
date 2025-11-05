import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import { useEffect } from "react";
import TaskFilterBar from "../components/UI/TaskFilterBar";
import KanbanBoard from "../components/Build/KanbanBoard";
import DataBoundary from "../components/UI/DataBoundary";
import { flowSteps } from "../data/mockData";
import { User } from "../types";
import { useParams } from "react-router-dom";
import { useProjectStore, useTaskStore, useUserStore } from "../store";
import StepNavigation from "../components/Build/StepNavigation/StepNavigation";
import StepDetails from "../components/Build/StepDetails/StepDetails";
import { filterTasks } from "../utils/taskFilterUtils";
import { useTaskFilters } from "../hooks/useTaskFilters";

interface BuildProps {
  activeStepId?: number | null;
  onStepChange?: (stepId: number) => void;
  onBackToProjects?: () => void;
  user?: User;
}

export default function Build({ activeStepId, onStepChange }: BuildProps) {
  const { user, userLoading, userError } = useUserStore();
  const { projectId } = useParams<{ projectId: string }>();
  const { projectsLoading, projectsError, fetchProject, selectedProject } =
    useProjectStore();

  // Use shallow selectors to only subscribe to tasks array, not loading states
  const tasks = useTaskStore((state) => state.tasks);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const tasksLoading = useTaskStore((state) => state.tasksLoading);
  const tasksError = useTaskStore((state) => state.tasksError);

  const [filters, setFilters] = useTaskFilters(projectId);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  if (!user) {
    return (
      <DataBoundary
        isLoading={userLoading}
        error={userError}
        isEmpty={!user}
        dataType="user"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <p className="text-red-500">User not found.</p>
        </div>
      </DataBoundary>
    );
  }

  if (!selectedProject) {
    return (
      <DataBoundary
        isLoading={projectsLoading}
        error={projectsError}
        isEmpty={!selectedProject}
        dataType="project"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <p className="text-red-500">Project not found.</p>
        </div>
      </DataBoundary>
    );
  }

  // Find the current step based on activeStepId, default to first step if none provided
  const currentStep = activeStepId
    ? flowSteps.find((step) => step.id === activeStepId) || flowSteps[0]
    : flowSteps[0];

  // Filter tasks for the current step
  const currentStepTasks = tasks.filter(
    (task) => task.stepId === currentStep.id
  );

  const filteredTasks = filterTasks(currentStepTasks, filters, user);

  return (
    <DataBoundary isLoading={tasksLoading} error={tasksError} dataType="tasks">
      <div className="p-4 md:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Hammer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Build
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user && user.role === "Builder"
                    ? "Choose and manage your tasks"
                    : "Manage tasks for the current step"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step Navigation */}
        {onStepChange && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StepNavigation
              currentStep={currentStep}
              allSteps={flowSteps}
              onStepChange={onStepChange}
            />
          </motion.div>
        )}

        {/* Current Step Context */}
        {currentStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StepDetails step={currentStep} tasks={tasks} />
          </motion.div>
        )}

        {/* Task Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <TaskFilterBar
            tasks={tasks}
            project={selectedProject}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredTasks.length > 0 ? (
            <KanbanBoard tasks={filteredTasks} user={user} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {tasks.length === 0
                  ? "This project doesn't have any tasks yet."
                  : "No tasks match the current filters. Try adjusting your filter criteria."}
              </p>
              {tasks.length > 0 && (
                <button
                  onClick={() =>
                    setFilters({
                      searchTerm: "",
                      myTasks: false,
                      priority: [],
                      categories: [],
                    })
                  }
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </DataBoundary>
  );
}
