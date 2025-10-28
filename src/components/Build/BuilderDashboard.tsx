import { motion } from "framer-motion";
import { User, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { Task, User as UserType } from "../../types";
import { COLORS } from "../../constants/colors";
import { getStatusColor, getStatusIcon } from "../../utils/statusUtils";

interface BuilderDashboardProps {
  tasks: Task[];
  user: UserType;
  onTaskUpdate: (taskId: number, status: number) => void;
}

export default function BuilderDashboard({
  tasks,
  user,
  onTaskUpdate,
}: BuilderDashboardProps) {
  const builderTasks = tasks.filter((task) => task.builder === user.address);
  const todoTasks = builderTasks.filter((task) => task.status === 0);
  const inProgressTasks = builderTasks.filter((task) => task.status === 1);
  const inReviewTasks = builderTasks.filter((task) => task.status === 2);
  const completedTasks = builderTasks.filter((task) => task.status === 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Builder Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {user.username || "Builder"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  To Do
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {todoTasks.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {inProgressTasks.length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Review
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {inReviewTasks.length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {completedTasks.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* My Tasks */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Tasks
        </h2>

        {builderTasks.length > 0 ? (
          <div className="space-y-4">
            {builderTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {task.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>

                  {task.status !== 3 && (
                    <div className="flex gap-2">
                      {task.status === 0 && (
                        <button
                          onClick={() => onTaskUpdate(task.id, 1)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${COLORS.button.primary} transition-colors`}
                        >
                          Start Task
                        </button>
                      )}
                      {task.status === 1 && (
                        <button
                          onClick={() => onTaskUpdate(task.id, 2)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors`}
                        >
                          Submit for Review
                        </button>
                      )}
                      {task.status === 2 && (
                        <span className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                          Waiting for Review
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tasks assigned
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You don't have any tasks assigned to you yet.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
