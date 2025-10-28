import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Project, User as UserType } from "../types";
import { useTasks, useTaskWorkflow } from "../hooks/useTasks";
import DataBoundary from "../components/UI/DataBoundary";
import KanbanBoard from "../components/Build/KanbanBoard";
import TaskFilterBar from "../components/UI/TaskFilterBar";
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
  const projectId = project.id.toString();
  const { tasks, loading, error, refetch } = useTasks(projectId);
  const { assignToSelf } = useTaskWorkflow();
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [filters, setFilters] = useTaskFilters(project.id);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Apply filters to project tasks
  const filteredTasks = filterTasks(tasks, filters, user);

  const handleTaskAssignment = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    // Only allow taking tasks that are in "todo" status and unassigned
    if (
      task &&
      (!task.builder || task.builder === "") &&
      task.status === 0 // todo status
    ) {
      const result = await assignToSelf(taskId.toString(), user.address);
      if (result) {
        refetch();
        setToast({
          message: "Task assigned and moved to In Progress",
          type: "success",
        });
      } else {
        setToast({
          message: "Failed to assign task",
          type: "error",
        });
      }
    } else if (task && task.status !== 0) {
      setToast({
        message: "Only tasks in 'To Do' column can be taken",
        type: "error",
      });
    }
  };

  return (
    <DataBoundary isLoading={loading} error={error} dataType="tasks">
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
                {tasks.length} tasks)
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
                <span className="font-medium">Progress:</span>{" "}
                {project.progress}%
              </div>
            </div>
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
            tasks={tasks}
            project={project}
            filters={filters}
            onFiltersChange={setFilters}
          />
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
                {tasks.length === 0
                  ? "This project doesn't have any tasks yet."
                  : "No tasks match the current filters. Try adjusting your filter criteria."}
              </p>
              {tasks.length > 0 && (
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
    </DataBoundary>
  );
}
