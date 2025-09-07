import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Task } from "../../types";
import Card from "../UI/Card";
import TaskForm from "./TaskTable/TaskForm";
import TaskRow from "./TaskTable/TaskRow";

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

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    onAddTask(newTask);
    setShowAddForm(false);
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
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowAddForm(false)}
        />
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
              <TaskRow
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
