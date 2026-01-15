import { motion } from "framer-motion";
import { Building2, CheckCircle2, ListTodo, Award, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { COLORS } from "../../constants/colors";
import { Project, Task } from "../../types";
import { formatDate } from "../../utils/dateUtils";

interface ProjectOverviewProps {
  project: Project;
  tasks: Task[];
}

export default function ProjectOverview({ project, tasks }: ProjectOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 3).length;
  const inProgressTasks = tasks.filter((task) => task.status === 1).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Determine if description is long (more than 300 characters)
  const isLongDescription = project.description && project.description.length > 300;
  const displayDescription = isExpanded || !isLongDescription 
    ? project.description 
    : project.description?.substring(0, 300) + "...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          {project.logo ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
              <img 
                src={project.logo} 
                alt={`${project.name} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center ${COLORS.primary[100]}"><svg class="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg></div>`;
                  }
                }}
              />
            </div>
          ) : (
            <div className={`p-3 rounded-lg ${COLORS.primary[100]}`}>
              <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h1>
            {project.description && (
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base whitespace-pre-line">
                  {displayDescription}
                </p>
                {isLongDescription && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Read more</span>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Progress Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Overall Progress
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {Math.round(project.progress)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Total Tasks Card */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <ListTodo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalTasks}
              </p>
            </div>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-green-900 dark:text-green-100">Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedTasks}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
                  / {totalTasks}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Rewards Card */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <p className="text-sm text-orange-900 dark:text-orange-100">Total Rewards</p>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 truncate">
                {parseFloat(project.bank || "0").toFixed(2)}
              </p>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                KUD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Created {formatDate(project.createdAt)}</span>
        </div>
        {inProgressTasks > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span>{inProgressTasks} task{inProgressTasks > 1 ? 's' : ''} in progress</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            completionRate === 100 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : completionRate > 50
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {completionRate}% Complete
          </div>
        </div>
      </div>
    </motion.div>
  );
}
