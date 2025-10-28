import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import ProgressBar from "../UI/ProgressBar";
import Card from "../UI/Card";

interface ProjectProgressProps {
  project: {
    progress: number;
  } | null;
}

function ProjectProgress({ project }: ProjectProgressProps) {
  return (
    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Project progress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Overall progress
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {project?.progress || 0}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    3/5 steps
                  </span>
                </div>
                <ProgressBar progress={project?.progress || 0} />
              </div>
            </Card>
          </motion.div>
  )
}

export default ProjectProgress