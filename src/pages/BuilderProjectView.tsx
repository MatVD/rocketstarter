import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Task, Project, User as UserType } from "../types";
import { tasks as initialTasks, mockUsers, flowSteps } from "../data/mockData";
import Toast from "../components/UI/Toast";
import TaskCard from "../components/UI/TaskCard";

interface BuilderProjectViewProps {
  project: Project;
  onBackToProjects: () => void;
  user: UserType;
}

export default function BuilderProjectView({
  project,
  onBackToProjects,
  user,
}: BuilderProjectViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Get all tasks for this project (across all steps)
  const projectTasks = tasks.filter(
    () =>
      // For now, showing all tasks - you may want to filter by project ID when available
      true
  );

  // Group tasks by status for better organization
  const tasksByStatus = {
    todo: projectTasks.filter((task) => task.status.toLowerCase() === "todo"),
    inProgress: projectTasks.filter(
      (task) => task.status.toLowerCase() === "in-progress"
    ),
    review: projectTasks.filter(
      (task) => task.status.toLowerCase() === "review"
    ),
    done: projectTasks.filter((task) => task.status.toLowerCase() === "done"),
  };

  const handleTakeTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, assignee: user.id } : t))
      );
      setToast({
        message: `Successfully took task: ${task.title}`,
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Create a callback that can take a task and assign it to the user
  const handleTaskAssignment = (taskId: string) => {
    handleTakeTask(taskId);
  };

  // Helper function to get step name from stepId
  const getStepName = (stepId: string) => {
    const step = flowSteps.find((s) => s.id === stepId);
    return step?.title || "Unknown Step";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with back button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBackToProjects}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Available tasks for this project
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tasks Grid Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Todo Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Circle className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              To Do ({tasksByStatus.todo.length})
            </h2>
          </div>
          {tasksByStatus.todo.length > 0 ? (
            <div className="space-y-3">
              {tasksByStatus.todo.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="simple"
                  projectName={project.name}
                  stepName={getStepName(task.stepId)}
                  user={user}
                  users={mockUsers}
                  getStatusColor={getStatusColor}
                  onTaskAssignment={handleTaskAssignment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Circle className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No tasks to do
              </p>
            </div>
          )}
        </div>

        {/* In Progress Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              In Progress ({tasksByStatus.inProgress.length})
            </h2>
          </div>
          {tasksByStatus.inProgress.length > 0 ? (
            <div className="space-y-3">
              {tasksByStatus.inProgress.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="simple"
                  projectName={project.name}
                  stepName={getStepName(task.stepId)}
                  user={user}
                  users={mockUsers}
                  getStatusColor={getStatusColor}
                  onTaskAssignment={handleTaskAssignment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No tasks in progress
              </p>
            </div>
          )}
        </div>

        {/* Done Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Completed ({tasksByStatus.done.length})
            </h2>
          </div>
          {tasksByStatus.done.length > 0 ? (
            <div className="space-y-3">
              {tasksByStatus.done.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  variant="simple"
                  projectName={project.name}
                  stepName={getStepName(task.stepId)}
                  user={user}
                  users={mockUsers}
                  getStatusColor={getStatusColor}
                  onTaskAssignment={handleTaskAssignment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No completed tasks
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Empty state */}
      {projectTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Circle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no tasks for this project yet.
          </p>
        </motion.div>
      )}

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
