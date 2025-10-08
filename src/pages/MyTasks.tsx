import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  CheckCircle2,
  Circle,
  AlertCircle,
  Filter,
  X,
} from "lucide-react";
import { Task, TaskStatus, User as UserType } from "../types";
import {
  tasks as initialTasks,
  mockProjects,
  mockUsers,
  flowSteps,
} from "../data/mockData";
import Toast from "../components/UI/Toast";
import TaskCard from "../components/UI/TaskCard";
import { getStatusColor, getStatusIcon } from "../utils/statusUtils";

interface MyTasksProps {
  user: UserType;
}

export default function MyTasks({ user }: MyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get all tasks assigned to the current user
  const myTasks = tasks.filter((task) => task.builder === user.address);

  // Apply filters
  const filteredTasks = myTasks.filter((task) => {
    // Filtrage par projet avec le nouveau champ projectId
    const projectMatch =
      selectedProject === "all" ||
      selectedProject === "current" || // Pour "current", on prend le premier projet par défaut
      task.project.name === selectedProject;

    const categoryMatch =
      selectedCategory === "all" || task.step.id === selectedCategory;

    return projectMatch && categoryMatch;
  });

  // Group filtered tasks by status for better organization
  const tasksByStatus = {
    todo: filteredTasks.filter((task) => task.status === 0),
    inProgress: filteredTasks.filter(
      (task) => task.status === 1
    ),
    review: filteredTasks.filter(
      (task) => task.status === 2
    ),
    done: filteredTasks.filter((task) => task.status === 3),
  };

  const handleUpdateTaskStatus = (taskId: number, newStatus: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus as TaskStatus } : t))
      );
      setToast({
        message: `Task "${task.title}" status updated to ${newStatus}`,
        type: "success",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  

  const getProjectName = (projectId: string) => {
    const project = mockProjects.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  // Helper function to get step name from stepId
  const getStepName = (stepId: string) => {
    const step = flowSteps.find((s) => s.id === stepId);
    return step?.title || "Unknown Step";
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
            All tasks you bring across all projects
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Projects</option>
                <option value="current">Current Project</option>
                {mockProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {flowSteps.map((step) => (
                  <option key={step.id} value={step.id}>
                    {step.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedProject !== "all" || selectedCategory !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Active filters:
              </span>
              {selectedProject !== "all" && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                  Project:{" "}
                  {selectedProject === "current"
                    ? "Current Project"
                    : mockProjects.find((p) => p.id === selectedProject)
                        ?.name || selectedProject}
                  <button
                    onClick={() => setSelectedProject("all")}
                    className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                  Category:{" "}
                  {flowSteps.find((s) => s.id === selectedCategory)?.title ||
                    selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Task Sections */}
      {filteredTasks.length > 0 ? (
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
                    variant="simple"
                    showProject
                    projectName={getProjectName(task.project.name)}
                    stepName={getStepName(task.step.title)}
                    user={user}
                    users={mockUsers}
                    onStatusChange={handleUpdateTaskStatus}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    statusButtons={[
                      {
                        label: "Start",
                        targetStatus: 1,
                        show: task.status !== 1,
                      },
                      {
                        label: "Review",
                        targetStatus: 2,
                        show: task.status !== 2,
                      },
                      {
                        label: "Complete",
                        targetStatus: 3,
                        show: task.status !== 3,
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
                    variant="simple"
                    showProject
                    projectName={getProjectName(task.project.name)}
                    stepName={getStepName(task.step.id)}
                    user={user}
                    users={mockUsers}
                    onStatusChange={handleUpdateTaskStatus}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    statusButtons={[
                      {
                        label: "Start",
                        targetStatus: 1,
                        show: task.status !== 1,
                      },
                      {
                        label: "Review",
                        targetStatus: 2,
                        show: task.status !== 2,
                      },
                      {
                        label: "Complete",
                        targetStatus: 3,
                        show: task.status !== 3,
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
                    variant="simple"
                    showProject
                    projectName={getProjectName(task.project.name)}
                    stepName={getStepName(task.step.id)}
                    user={user}
                    users={mockUsers}
                    onStatusChange={handleUpdateTaskStatus}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    statusButtons={[
                      {
                        label: "Start",
                        targetStatus: 1,
                        show: task.status !== 1,
                      },
                      {
                        label: "Review",
                        targetStatus: 2,
                        show: task.status !== 2,
                      },
                      {
                        label: "Complete",
                        targetStatus: 3,
                        show: task.status !== 3,
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
      ) : myTasks.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Filter className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No tasks match your filters
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your filters to see more tasks.
          </p>
          <button
            onClick={() => {
              setSelectedProject("all");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </motion.div>
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
