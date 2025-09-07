import { useState } from "react";
import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import TaskTable from "../components/Build/TaskTable";
import KanbanBoard from "../components/Build/KanbanBoard";
import StepNavigation from "../components/Build/StepNavigation";
import StepDetails from "../components/Build/StepDetails";
import { tasks as initialTasks, flowSteps } from "../data/mockData";
import { Task } from "../types";
import {
  DEFAULT_COLUMNS,
  Column,
} from "../components/Build/KanbanBoard/kanbanUtils";

interface BuildProps {
  activeStepId?: string | null;
  onStepChange?: (stepId: string) => void;
}

export default function Build({ activeStepId, onStepChange }: BuildProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);

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

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <Hammer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Build - {currentStep.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage tasks for the current step: {currentStep.description}
            </p>
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
        />
      </motion.div>
    </div>
  );
}
