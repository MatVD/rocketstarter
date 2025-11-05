import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import KanbanBoard from "../components/Build/KanbanBoard";
import DataBoundary from "../components/UI/DataBoundary";
import { flowSteps } from "../data/mockData";
import { Task, User } from "../types";
import { useParams } from "react-router-dom";
import { useProjectStore, useTaskStore, useUserStore } from "../store";
import TaskTable from "../components/Build/KanbanBoard/TaskTable/TaskTable";
import StepNavigation from "../components/Build/StepNavigation/StepNavigation";
import StepDetails from "../components/Build/StepDetails/StepDetails";
import { useEffect } from "react";

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
  const {
    createNewTask,
    tasks,
    updateExistingTask,
    assignTaskToSelf,
    removeTask,
    fetchTasks,
    tasksLoading,
    tasksError,
  } = useTaskStore();

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

  const handleAddTask = async (
    newTask: Omit<
      Task,
      "id" | "stepId" | "createdAt" | "updatedAt" | "projectId"
    >
  ) => {
    if (!projectId) return;

    const result = await createNewTask({
      ...newTask,
      projectId: parseInt(projectId),
      stepId: currentStep.id.toString(),
    });

    if (result) {
      fetchTasks();
    }
  };

  const handleEditTask = (taskId: number) => {
    alert(`Edit task ${taskId} - Feature to implement`);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const success = await removeTask(taskId.toString());
      if (success) {
        fetchTasks();
      }
    }
  };

  const handleMoveTask = async (taskId: number, newStatus: Task["status"]) => {
    const result = await updateExistingTask(taskId.toString(), {
      status: newStatus,
    });
    if (result) {
      fetchTasks();
    }
  };

  // Builder-specific task assignment logic
  const handleTaskAssignment = async (taskId: number) => {
    if (user && user.role === "Builder" && user.address) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const result = await assignTaskToSelf(taskId, user.address);
        if (result) {
          fetchTasks();
        }
      }
    }
  };

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

        {/* Upper section - Task management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TaskTable
            tasks={currentStepTasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            user={user}
          />
        </motion.div>

        {/* Lower section - Kanban board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <KanbanBoard
            tasks={currentStepTasks}
            onMoveTask={handleMoveTask}
            user={user}
            onTaskAssignment={handleTaskAssignment}
          />
        </motion.div>
      </div>
    </DataBoundary>
  );
}
