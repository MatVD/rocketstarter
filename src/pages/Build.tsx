import { useState } from "react";
import { motion } from "framer-motion";
import { Hammer, SettingsIcon } from "lucide-react";
import TaskTable from "../components/Build/TaskTable";
import KanbanBoard from "../components/Build/KanbanBoard";
import StepNavigation from "../components/Build/StepNavigation";
import StepDetails from "../components/Build/StepDetails";
import Toast from "../components/UI/Toast";
import { tasks as initialTasks, flowSteps, mockUsers } from "../data/mockData";
import { Task, Project, User } from "../types";
import {
  DEFAULT_COLUMNS,
  Column,
} from "../components/Build/KanbanBoard/kanbanUtils";

interface BuildProps {
  activeStepId?: string | null;
  onStepChange?: (stepId: string) => void;
  onSettingsClick?: () => void;
  project?: Project;
  onBackToProjects?: () => void;
  user?: User;
}

export default function Build({
  activeStepId,
  onStepChange,
  onSettingsClick,
  user = mockUsers[1], // Default to Bob Builder
}: BuildProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
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

  const handleAddTask = (newTask: Omit<Task, "id" | "stepId">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      stepId: currentStep.id, // Associate new task with current step
    };
    setTasks([...tasks, task]);
  };

  const handleEditTask = (taskId: string) => {
    alert(`Edit task ${taskId} - Feature to implement`);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleMoveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Builder-specific task assignment logic
  const handleTaskAssignment = (taskId: string) => {
    if (user.role === "builder") {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setTasks(
          tasks.map((t) => (t.id === taskId ? { ...t, assignee: user.id } : t))
        );
        setToast({
          message: `Successfully took task: ${task.title}`,
          type: "success",
        });
        // Auto-hide toast after 3 seconds
        setTimeout(() => setToast(null), 3000);
      }
    }
  };

  return (
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
                {user.role === "builder"
                  ? "Choose and manage your tasks"
                  : "Manage tasks for the current step"}
              </p>
            </div>
          </div>

          <div>
            <motion.button
              onClick={onSettingsClick}
              aria-label="Open settings"
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SettingsIcon className="w-8 h-8" />
            </motion.button>
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
  );
}
