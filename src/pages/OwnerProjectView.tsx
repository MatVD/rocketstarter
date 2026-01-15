import { motion } from "framer-motion";
import { Hammer, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import TaskFilterBar from "../components/UI/TaskFilterBar";
import KanbanBoard from "../components/Kanban/KanbanBoard/KanbanBoard";
import DataBoundary from "../components/UI/DataBoundary";
import { User } from "../types";
import { useParams } from "react-router-dom";
import { useProjectStore, useTaskStore, useUserStore, useStepStore } from "../store";
import StepDetails from "../components/Kanban/StepDetails/StepDetails";
import { filterTasks } from "../utils/taskFilterUtils";
import { useTaskFilters } from "../hooks/useTaskFilters";
import AddTaskModal from "../components/Kanban/KanbanBoard/AddTaskModal";
import { COLORS } from "../constants/colors";
import ProjectOverview from "../components/Project/ProjectOverview";
import ModernStepNavigation from "../components/Kanban/StepNavigation/ModernStepNavigation";

interface BuildProps {
  activeStepId?: number | null;
  onStepChange?: (stepId: number) => void;
  onBackToProjects?: () => void;
  user?: User;
}

export default function Build({ activeStepId, onStepChange }: BuildProps) {
  // Use data from store - globally loaded in AppLayout
  const user = useUserStore((state) => state.user);
  const users = useUserStore((state) => state.users);
  const userLoading = useUserStore((state) => state.userLoading);
  const userError = useUserStore((state) => state.userError);
  
  const { projectId } = useParams<{ projectId: string }>();
  
  const projectsLoading = useProjectStore((state) => state.projectsLoading);
  const projectsError = useProjectStore((state) => state.projectsError);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const fetchProject = useProjectStore((state) => state.fetchProject);

  const tasks = useTaskStore((state) => state.tasks);
  const tasksLoading = useTaskStore((state) => state.tasksLoading);
  const tasksError = useTaskStore((state) => state.tasksError);
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  const steps = useStepStore((state) => state.steps);
  const stepsLoading = useStepStore((state) => state.stepsLoading);
  const stepsError = useStepStore((state) => state.stepsError);
  const fetchSteps = useStepStore((state) => state.fetchSteps);

  const [filters, setFilters] = useTaskFilters(projectId);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<number | null>(null);

  // Fetch project-specific data (project, tasks, steps)
  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
      fetchTasks(projectId);
      fetchSteps(projectId);
    }
  }, [projectId, fetchProject, fetchTasks, fetchSteps]);

  // Set initial step when steps are loaded
  useEffect(() => {
    if (steps.length > 0 && currentStepId === null) {
      setCurrentStepId(steps[0].id);
    }
  }, [steps, currentStepId]);

  // Wait for user to be loaded before rendering content
  if (userLoading || !user) {
    return (
      <DataBoundary
        isLoading={userLoading}
        error={userError}
        isEmpty={!user && !userLoading}
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
        isEmpty={!selectedProject && !projectsLoading}
        dataType="project"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <p className="text-red-500">Project not found.</p>
        </div>
      </DataBoundary>
    );
  }

  // Find the current step based on currentStepId
  const currentStep = currentStepId
    ? steps.find((step) => step.id === currentStepId) || steps[0]
    : steps[0];

  // CRITICAL: Filter tasks by projectId first, then by stepId
  const projectTasks = tasks.filter(
    (task) => task.projectId === selectedProject.id
  );
  
  const currentStepTasks = currentStep
    ? projectTasks.filter((task) => task.stepId === currentStep.id)
    : projectTasks;

  const filteredTasks = filterTasks(currentStepTasks, filters, user);

  console.log('[OwnerProjectView] Task filtering:', {
    projectId: selectedProject.id,
    totalTasksInStore: tasks.length,
    projectTasks: projectTasks.length,
    currentStepId: currentStep?.id,
    currentStepTasks: currentStepTasks.length,
    afterUserFilters: filteredTasks.length,
    stepsCount: steps.length
  });

  return (
    <DataBoundary isLoading={tasksLoading || stepsLoading} error={tasksError || stepsError} dataType="tasks">
      <div className="p-4 md:p-10 lg:p-12 space-y-6">
        {/* Project Overview Section */}
        <ProjectOverview project={selectedProject} tasks={projectTasks} />

        {/* Modern Step Navigation */}
        {steps.length > 0 && (
          <ModernStepNavigation
            steps={steps}
            currentStepId={currentStepId}
            onStepChange={setCurrentStepId}
          />
        )}

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
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Tasks
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentStep ? `Manage tasks for ${currentStep.name}` : 'Manage project tasks'}
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

        {/* Step Navigation - Keep old one if onStepChange prop exists (backward compat) */}
        {onStepChange && steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Legacy navigation can be removed later */}
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
          <KanbanBoard tasks={filteredTasks} user={user} users={users} />
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
