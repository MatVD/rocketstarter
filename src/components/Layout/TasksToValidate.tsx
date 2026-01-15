import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronRight, Award } from "lucide-react";
import { useState, useMemo } from "react";
import { useTaskStore, useUserStore, useProjectStore } from "../../store";
import { useNavigate } from "react-router-dom";

export default function TasksToValidate() {
  const { user } = useUserStore();
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  // Get tasks that need validation (status 2 = In Review) where user is taskOwner
  const tasksToValidate = useMemo(() => {
    if (!user?.address) return [];
    
    return tasks.filter(
      (task) =>
        task.status === 2 && // In Review
        task.taskOwner?.toLowerCase() === user.address.toLowerCase()
    );
  }, [tasks, user]);

  const count = tasksToValidate.length;

  if (count === 0) return null;

  const handleTaskClick = (taskId: number, projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors group"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">
            Tasks to Validate
          </span>
          {count > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-xs font-bold rounded-full">
              {count}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {tasksToValidate.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                
                return (
                  <button
                    key={task.id}
                    onClick={() => handleTaskClick(task.id, task.projectId)}
                    className="w-full p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-orange-200 dark:border-orange-800 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {task.title}
                      </p>
                      {task.reward && parseFloat(task.reward) > 0 && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0">
                          <Award className="w-3 h-3" />
                          {parseFloat(task.reward).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {project && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {project.name}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
