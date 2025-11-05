import { motion } from "framer-motion";
import { Edit, Trash2, User } from "lucide-react";
import { Task } from "../../../../types";
import { getStatusBadge } from "./taskStatusUtils";
import { useTaskStore } from "../../../../store";
import { useToast } from "../../../../contexts/ToastContext";

interface TaskRowProps {
  task: Task;
  index: number;
}

export default function TaskRow({ task, index }: TaskRowProps) {
  const { removeTask } = useTaskStore();
  const { showSuccess, showError } = useToast();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      const success = await removeTask(task.id.toString());
      if (success) {
        showSuccess("Task deleted successfully!");
      } else {
        showError("Failed to delete task. Please try again.");
      }
    }
  };
  return (
    <motion.tr
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
      <td className="py-3 px-4 whitespace-nowrap">
        {getStatusBadge(task.status)}
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-gray-900 dark:text-white">
            {task.builder || "Unassigned"}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex space-x-2">
          <motion.button
            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Edit task"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}
