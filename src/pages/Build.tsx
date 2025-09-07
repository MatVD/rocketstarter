import { useState } from "react";
import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import TaskTable from "../components/Build/TaskTable";
import KanbanBoard from "../components/Build/KanbanBoard";
import { tasks as initialTasks } from "../data/mockData";
import { Task } from "../types";

export default function Build() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    };
    setTasks([...tasks, task]);
  };

  const handleEditTask = (taskId: string) => {
    alert(`Édition de la tâche ${taskId} - Fonctionnalité à implémenter`);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleMoveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <Hammer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Build
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez vos tâches et suivez l'avancement du projet
            </p>
          </div>
        </div>
      </motion.div>

      {/* Section supérieure - Gestion des tâches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TaskTable
          tasks={tasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </motion.div>

      {/* Section inférieure - Tableau Kanban */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <KanbanBoard tasks={tasks} onMoveTask={handleMoveTask} />
      </motion.div>
    </div>
  );
}