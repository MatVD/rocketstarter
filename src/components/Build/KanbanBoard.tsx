import { motion } from "framer-motion";
import { User, Calendar } from "lucide-react";
import { Task } from "../../types";
import Card from "../UI/Card";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: Task["status"]) => void;
}

export default function KanbanBoard({ tasks, onMoveTask }: KanbanBoardProps) {
  const columns = [
    {
      id: "todo" as const,
      title: "To do",
      color: "bg-gray-100 dark:bg-gray-800",
      headerColor: "bg-gray-200 dark:bg-gray-700",
    },
    {
      id: "in-progress" as const,
      title: "In progress",
      color: "bg-orange-50 dark:bg-orange-900/10",
      headerColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      id: "done" as const,
      title: "Done",
      color: "bg-green-50 dark:bg-green-900/10",
      headerColor: "bg-green-100 dark:bg-green-900/20",
    },
  ];

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Project dashboard
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div
              className={`${column.headerColor} rounded-lg p-3 flex items-center justify-between`}
            >
              <h4 className="font-medium text-gray-900 dark:text-white">
                {column.title}
              </h4>
              <span className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            <div className={`${column.color} rounded-lg p-3 min-h-[400px]`}>
              <div className="space-y-3">
                {getTasksByStatus(column.id).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card hover className="p-4 cursor-pointer">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        {task.title}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {task.assignee}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{task.createdAt}</span>
                        </div>
                      </div>

                      {/* Movement buttons (simulation) */}
                      <div className="mt-3 flex space-x-2">
                        {column.id !== "todo" && (
                          <motion.button
                            onClick={() =>
                              onMoveTask(
                                task.id,
                                column.id === "done" ? "in-progress" : "todo"
                              )
                            }
                            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ← Previous
                          </motion.button>
                        )}
                        {column.id !== "done" && (
                          <motion.button
                            onClick={() =>
                              onMoveTask(
                                task.id,
                                column.id === "todo" ? "in-progress" : "done"
                              )
                            }
                            className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Next →
                          </motion.button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
