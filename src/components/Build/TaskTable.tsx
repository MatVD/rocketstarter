import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, User } from "lucide-react";
import { Task } from "../../types";
import Card from "../UI/Card";

interface TaskTableProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskTable({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TaskTableProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as const,
    assignee: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const getStatusBadge = (status: Task["status"]) => {
    const styles = {
      todo: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
      "in-progress":
        "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400",
      done: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400",
    };

    const labels = {
      todo: "To do",
      "in-progress": "In progress",
      done: "Done",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.assignee) {
      onAddTask(newTask);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        assignee: "",
        createdAt: new Date().toISOString().split("T")[0],
      });
      setShowAddForm(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Task management
        </h3>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>New task</span>
        </motion.button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <input
                type="text"
                placeholder="Assignee"
                value={newTask.assignee}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={2}
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Title
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Description
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Assignee
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                    {task.description}
                  </div>
                </td>
                <td className="py-3 px-4">{getStatusBadge(task.status)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {task.assignee}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => onEditTask(task.id)}
                      className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
