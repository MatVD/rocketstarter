import { useState } from "react";
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
import { useTasks, useTaskMutations, useTaskWorkflow } from "../hooks/useTasks";
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
  const { tasks, loading, error, refetch } = useTasks(projectId);
  const { create, update, remove } = useTaskMutations();
  const { assignToSelf } = useTaskWorkflow();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

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

    const result = await create({
      ...newTask,
      projectId: parseInt(projectId),
      stepId: currentStep.id.toString(),
    });

    if (result) {
      refetch();
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
      const success = await remove(taskId.toString());
      if (success) {
        refetch();
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
    const result = await update(taskId.toString(), { status: newStatus });
    if (result) {
      refetch();
    } else {
      setToast({
        message: "Failed to update task",
        type: "error",
      });
    }
  };

  // Builder-specific task assignment logic
  const handleTaskAssignment = async (taskId: number) => {
    if (user && user.role === "Builder" && user.address) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const result = await assignToSelf(taskId.toString(), user.address);
        if (result) {
          refetch();
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
