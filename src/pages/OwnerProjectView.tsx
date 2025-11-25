import { motion } from "framer-motion";
import { Hammer, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import TaskFilterBar from "../components/UI/TaskFilterBar";
import KanbanBoard from "../components/Kanban/KanbanBoard/KanbanBoard";
import DataBoundary from "../components/UI/DataBoundary";
import { flowSteps } from "../data/mockData";
import { User } from "../types";
import { useParams } from "react-router-dom";
import { useProjectStore, useTaskStore, useUserStore } from "../store";
import StepNavigation from "../components/Kanban/StepNavigation/StepNavigation";
import StepDetails from "../components/Kanban/StepDetails/StepDetails";
import { filterTasks } from "../utils/taskFilterUtils";
import { useTaskFilters } from "../hooks/useTaskFilters";
import AddTaskModal from "../components/Kanban/AddTaskModal";
import { COLORS } from "../constants/colors";

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
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

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
            {user && user.role === "Owner" && (
              <button
                onClick={() => setIsAddTaskModalOpen(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${COLORS.button.primary}`}
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            )}
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
          <KanbanBoard tasks={filteredTasks} user={user} />
        </motion.div>
      </div>

      {selectedProject && (
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          projectId={selectedProject.id}
          stepId={currentStep?.id}
        />
      )}
    </DataBoundary>
  );
}
