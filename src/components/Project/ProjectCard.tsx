import { motion } from "framer-motion";
import { Building2, Calendar, ChevronRight } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { formatDate } from "../../utils/dateUtils";
import { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";

function ProjectCard({ project, index }: ProjectCardProps) {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const onProjectClick = () => {
    // Navigate to unified project details page
    navigate(`/projects/${project.id}`);
  };

  return (
    <motion.div
      key={project.id}
      onClick={onProjectClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="p-6">
        {/* Project Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {project.logo ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
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
                      parent.innerHTML = `<div class="w-full h-full flex items-center justify-center ${COLORS.primary[100]}"><svg class="w-5 h-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg></div>`;
                    }
                  }}
                />
              </div>
            ) : (
              <div className={`p-2 rounded-lg ${COLORS.primary[100]}`}>
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>

        {/* Project Description */}
        {project.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(project.progress)} %
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Project Meta */}
        <div className="space-y-2">
          {project.createdAt && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
