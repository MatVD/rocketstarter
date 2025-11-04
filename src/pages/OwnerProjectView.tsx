import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import TaskTable from "../components/Build/TaskTable";
import KanbanBoard from "../components/Build/KanbanBoard";
import StepNavigation from "../components/Build/StepNavigation";
import StepDetails from "../components/Build/StepDetails";
import Toast from "../components/UI/Toast";
import DataBoundary from "../components/UI/DataBoundary";
import { flowSteps } from "../data/mockData";
import { Task, User } from "../types";
import { useTaskStore } from "../store";
import {
  DEFAULT_COLUMNS,
  Column,
} from "../components/Build/KanbanBoard/kanbanUtils";
import { useParams } from "react-router-dom";

interface BuildProps {
  activeStepId?: number | null;
  onStepChange?: (stepId: number) => void;
  onBackToProjects?: () => void;
  user?: User;
}

export default function Build({
  activeStepId,
  onStepChange,
  user,
}: BuildProps) {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Use Zustand store instead of custom hook for better performance
  const { 
    tasks, 
    tasksLoading: loading, 
    tasksError: error,
    fetchTasks,
    createNewTask,
    updateExistingTask,
    removeTask,
  } = useTaskStore();
  
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Fetch tasks when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  // Find the current step based on activeStepId, default to first step if none provided
  const currentStep = activeStepId
    ? flowSteps.find((step) => step.id === activeStepId) || flowSteps[0]
    : flowSteps[0];

  // Filter tasks for the current step
  const currentStepTasks = tasks.filter(
    (task: Task) => task.stepId === currentStep.id
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
      // No refetch needed - store handles optimistic update
      setToast({
        message: "Task created successfully",
        type: "success",
      });
    } else {
      setToast({
        message: "Failed to create task",
        type: "error",
      });
    }
  };

  const handleEditTask = (taskId: number) => {
    alert(`Edit task ${taskId} - Feature to implement`);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const success = await removeTask(taskId.toString());
      if (success) {
        // No refetch needed - store handles optimistic update
        setToast({
          message: "Task deleted successfully",
          type: "success",
        });
      } else {
        setToast({
          message: "Failed to delete task",
          type: "error",
        });
      }
    }
  };

  const handleMoveTask = async (taskId: number, newStatus: Task["status"]) => {
    // Optimistic update - no await, no refetch
    // Store handles the update immediately and syncs with backend
    await updateExistingTask(taskId.toString(), { status: newStatus });
    // Don't show error toast here - store will handle rollback on error
  };

  // Builder-specific task assignment logic
  const handleTaskAssignment = async (taskId: number) => {
    if (user && user.role === "Builder" && user.address) {
      const task = tasks.find((t: Task) => t.id === taskId);
      if (task) {
        const result = await updateExistingTask(taskId.toString(), { 
          builderAddress: user.address,
          status: 1, // Move to "in progress"
        });
        if (result) {
          // No refetch needed - store handles optimistic update
          setToast({
            message: `Successfully took task: ${task.title}`,
            type: "success",
          });
        } else {
          setToast({
            message: "Failed to assign task",
            type: "error",
          });
        }
        // Auto-hide toast after 3 seconds
        setTimeout(() => setToast(null), 3000);
      }
    }
  };

  return (
    <DataBoundary isLoading={loading} error={error} dataType="tasks">
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
            columns={columns}
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
            columns={columns}
            setColumns={setColumns}
            onMoveTask={handleMoveTask}
            user={user}
            onTaskAssignment={handleTaskAssignment}
          />
        </motion.div>

        {/* Toast notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </DataBoundary>
  );
}
