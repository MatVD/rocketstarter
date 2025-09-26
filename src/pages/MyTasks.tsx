import { useState } from "react";
import { motion } from "framer-motion";
import { User, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Task, User as UserType } from "../types";
import { tasks as initialTasks, mockProjects } from "../data/mockData";
import Toast from "../components/UI/Toast";
import TaskCard from "../components/UI/TaskCard";

interface MyTasksProps {
  user: UserType;
}

export default function MyTasks({ user }: MyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Get all tasks assigned to the current user
  const myTasks = tasks.filter((task) => task.assignee === user.id);

  // Group tasks by status for better organization
  const tasksByStatus = {
    todo: myTasks.filter((task) => task.status.toLowerCase() === "todo"),
    inProgress: myTasks.filter(
      (task) => task.status.toLowerCase() === "in-progress"
    ),
    review: myTasks.filter((task) => task.status.toLowerCase() === "review"),
    done: myTasks.filter((task) => task.status.toLowerCase() === "done"),
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      setToast({
        message: `Task "${task.title}" status updated to ${newStatus}`,
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return <Circle className="w-4 h-4" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />;
      case "review":
        return <Clock className="w-4 h-4" />;
      case "done":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getProjectName = () => {
    // This is a simplified approach - in a real app, you'd have proper project-task relationships
    const project = mockProjects[0]; // Fallback to first project
    return project?.name || "Unknown Project";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            All tasks assigned to you across all projects
          </p>
        </div>
      </motion.div>

      {/* Task Sections */}
      {myTasks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    variant="list"
                    showProject
                    projectName={getProjectName()}
                    onStatusChange={handleUpdateTaskStatus}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    statusButtons={[
                      {
                        label: "Start",
                        targetStatus: "in-progress",
                        show: task.status.toLowerCase() !== "in-progress",
                      },
                      {
                        label: "Review",
                        targetStatus: "review",
                        show: task.status.toLowerCase() !== "review",
                      },
                      {
                        label: "Complete",
                        targetStatus: "done",
                        show: task.status.toLowerCase() !== "done",
                      },
                    ]}
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
                    variant="list"
                    showProject
                    projectName={getProjectName()}
                    onStatusChange={handleUpdateTaskStatus}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    statusButtons={[
                      {
                        label: "Start",
                        targetStatus: "in-progress",
                        show: task.status.toLowerCase() !== "in-progress",
                      },
                      {
                        label: "Review",
                        targetStatus: "review",
                        show: task.status.toLowerCase() !== "review",
                      },
                      {
                        label: "Complete",
                        targetStatus: "done",
                        show: task.status.toLowerCase() !== "done",
                      },
                    ]}
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
                    variant="list"
                    showProject
                    projectName={getProjectName()}
                    onStatusChange={handleUpdateTaskStatus}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    statusButtons={[
                      {
                        label: "Start",
                        targetStatus: "in-progress",
                        show: task.status.toLowerCase() !== "in-progress",
                      },
                      {
                        label: "Review",
                        targetStatus: "review",
                        show: task.status.toLowerCase() !== "review",
                      },
                      {
                        label: "Complete",
                        targetStatus: "done",
                        show: task.status.toLowerCase() !== "done",
                      },
                    ]}
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
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <User className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks assigned
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Go to Projects to find and take on some tasks!
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
