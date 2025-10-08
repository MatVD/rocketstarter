import { motion } from "framer-motion";
import { Step } from "../../types";
import Card from "../UI/Card";
import { getStatusIcon, getStatusColor } from "../../utils/statusUtils";

interface StepCardProps {
  step: Step;
  showButton?: boolean;
  onComplete?: (stepId: string) => void;
}

export default function StepCard({
  step,
  showButton = false,
  onComplete,
}: StepCardProps) {
  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div
            className={`p-2 rounded-lg ${getStatusColor(
              step.status
            )}`}
          >
            {getStatusIcon(step.status)}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {step.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {step.description}
            </p>
          </div>
        </div>

        {showButton && step.status !== "completed" && (
          <motion.button
            onClick={() => onComplete?.(step.id)}
            className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Complete
          </motion.button>
        )}
      </div>
    </Card>
  );
}
