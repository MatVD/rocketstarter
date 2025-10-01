import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Circle, User, CheckCircle2 } from "lucide-react";
import { Task, Project, User as UserType } from "../types";
import { tasks as initialTasks, mockUsers, flowSteps } from "../data/mockData";
import Card from "../components/UI/Card";
import Toast from "../components/UI/Toast";

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

  // Sort tasks: unassigned tasks first (regardless of status), then assigned tasks
  const sortedTasks = [...projectTasks].sort((a, b) => {
    // Check if tasks are unassigned
    const aIsUnassigned = !a.assignee || a.assignee === "";
    const bIsUnassigned = !b.assignee || b.assignee === "";

    // If one is unassigned and the other is not, unassigned comes first
    if (aIsUnassigned && !bIsUnassigned) return -1;
    if (!aIsUnassigned && bIsUnassigned) return 1;

    // If both have the same assignment status, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
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

      {/* Tasks List Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Available Tasks ({sortedTasks.length})
          </h2>
        </div>

        {sortedTasks.length > 0 ? (
          <div className="space-y-4">
            {sortedTasks.map((task, index) => {
              const isHighPriority =
                !task.assignee ||
                task.assignee === "" ||
                task.status.toLowerCase() === "todo";
              const assignedUser = mockUsers.find(
                (u) => u.id === task.assignee
              );
              const canTakeTask = !task.assignee || task.assignee === "";

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    hover
                    className={`p-4 ${
                      isHighPriority ? "border-l-4 border-orange-400" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status.toLowerCase() === "done" ? (
                                <CheckCircle2 className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                              ) : (
                                <Circle className="w-3 h-3 mr-1 text-gray-600 dark:text-gray-400" />
                              )}
                              {task.status}
                            </span>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {task.title}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {getStepName(task.stepId)}
                              </span>
                            </div>
                          </div>

                          {/* Assignment Status & Action Button */}
                          <div className="flex items-center space-x-3">
                            {assignedUser ? (
                              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4" />
                                <span>
                                  {assignedUser.name || assignedUser.id}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-sm text-orange-600 dark:text-orange-400">
                                <User className="w-4 h-4" />
                                <span>Unassigned</span>
                              </div>
                            )}

                            {canTakeTask && (
                              <motion.button
                                onClick={() => handleTaskAssignment(task.id)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm rounded-lg transition-colors font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Take Task
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Task Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Circle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                There are no tasks for this project yet.
              </p>
            </div>
          </Card>
        )}
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
