import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Task, Project, User as UserType } from "../types";
import { tasks as initialTasks } from "../data/mockData";
import KanbanBoard from "../components/Build/KanbanBoard";
import TaskFilterBar from "../components/Build/TaskFilterBar";
import { filterTasks } from "../utils/taskFilterUtils";
import { useTaskFilters } from "../hooks/useTaskFilters";
import Toast from "../components/UI/Toast";
import {
  DEFAULT_COLUMNS,
  Column,
} from "../components/Build/KanbanBoard/kanbanUtils";

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
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [filters, setFilters] = useTaskFilters(project.id);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Filter tasks for this specific project
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  // Apply filters to project tasks
  const filteredTasks = filterTasks(projectTasks, filters, user);

  const handleTaskAssignment = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    // Only allow taking tasks that are in "todo" status and unassigned
    if (
      task &&
      (!task.assignee || task.assignee === "") &&
      task.status === "todo"
    ) {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assignee: user.id,
                status: "in-progress", // Automatically move to In Progress when assigned
              }
            : t
        )
      );

      setToast({
        message: "Task assigned and moved to In Progress",
        type: "success",
      });
    } else if (task && task.status !== "todo") {
      setToast({
        message: "Only tasks in 'To Do' column can be taken",
        type: "error",
      });
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={onBackToProjects}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Project tasks organized by status ({filteredTasks.length} of{" "}
              {projectTasks.length} tasks)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Project Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Environment:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.environment === "mainnet"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                }`}
              >
                {project.environment}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Progress:</span> {project.progress}%
            </div>
          </div>
          {project.tags && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Task Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-6"
      >
        <TaskFilterBar
          tasks={projectTasks}
          project={project}
          filters={filters}
          onFiltersChange={setFilters}
        />
        {(filters.searchTerm ||
          filters.myTasks ||
          filters.priority.length > 0 ||
          filters.categories.length > 0) && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTasks.length} of {projectTasks.length} tasks
          </div>
        )}
      </motion.div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredTasks.length > 0 ? (
          <KanbanBoard
            tasks={filteredTasks}
            columns={columns}
            setColumns={setColumns}
            onMoveTask={() => {}} // Disabled for builders
            user={user}
            onTaskAssignment={handleTaskAssignment}
            isBuilderMode={true} // Add this prop to indicate builder mode
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {projectTasks.length === 0
                ? "This project doesn't have any tasks yet."
                : "No tasks match the current filters. Try adjusting your filter criteria."}
            </p>
            {projectTasks.length > 0 && (
              <button
                onClick={() =>
                  setFilters({
                    searchTerm: "",
                    myTasks: false,
                    priority: [],
                    categories: [],
                  })
                }
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            )}
          </div>
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
