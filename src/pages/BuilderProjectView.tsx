import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { useUserStore } from "../store/user.store";
import { useParams } from "react-router-dom";
import { useProjectStore } from "../store/project.store";
import { useTaskStore } from "../store";
import { Task } from "../types";

export default function BuilderProjectView() {
  const { user, userLoading, userError } = useUserStore();
  const { projectId } = useParams<{ projectId: string }>();
  const { projectsLoading, projectsError, fetchProject } = useProjectStore();
  const {
    tasks,
    fetchTasks,
    tasksLoading,
    tasksError,
    assignTaskToSelf,
    refetchTasks,
    updateExistingTask,
  } = useTaskStore();
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [filters, setFilters] = useTaskFilters(projectId);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const { selectedProject } = useProjectStore();

  if (!user) {
    return (
      <DataBoundary
        isLoading={userLoading}
        error={userError}
        isEmpty={!user}
        dataType="user"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <p className="text-red-500">User not found.</p>
        </div>
      </DataBoundary>
    );
  }

  if (!selectedProject) {
    return (
      <DataBoundary
        isLoading={projectsLoading}
        error={projectsError}
        isEmpty={!selectedProject}
        dataType="project"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <p className="text-red-500">Project not found.</p>
        </div>
      </DataBoundary>
    );
  }

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
      const result = await assignTaskToSelf(taskId, user.address);
      if (result) {
        setToast({
          message: "Task assigned and moved to In Progress",
          type: "success",
        });
        refetchTasks();
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

  const handleMoveTask = async (taskId: number, newStatus: Task["status"]) => {
    const result = await updateExistingTask(taskId.toString(), {
      status: newStatus,
    });
    if (result) {
      refetchTasks();
    } else {
      setToast({
        message: "Failed to update task",
        type: "error",
      });
    }
  };

  return (
    <DataBoundary isLoading={tasksLoading} error={tasksError} dataType="tasks">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {selectedProject.name}
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
                {selectedProject.progress}%
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
            project={selectedProject}
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
              onMoveTask={handleMoveTask}
              user={user}
              onTaskAssignment={handleTaskAssignment}
              isBuilderMode={false} // Add this prop to indicate builder mode
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
