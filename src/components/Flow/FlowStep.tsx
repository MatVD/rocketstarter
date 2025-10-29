import { ArrowRight } from "lucide-react";
import { Step } from "../../types";
import Card from "../UI/Card";
import {
  getStatusIcon,
  getStatusColor,
  getBorderColor,
} from "../../utils/statusUtils";

interface FlowStepProps {
  step: Step;
  isLast?: boolean;
}

export default function FlowStep({
  step,
  isLast = false,
}: FlowStepProps) {
  return (
    <div className="flex items-center">
      <Card
        hover
        className={`p-3 md:p-4 min-w-[250px] md:min-w-[280px] border-2 ${getBorderColor(
          step.status
        )}`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
            {getStatusIcon(step.status, )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              {step.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {step.description}
            </p>
            {/* <motion.button
              onClick={() => onDetails(step.id)}
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              whileHover={{ scale: 1.05 }}
            >
              <span>View details</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button> */}
          </div>
        </div>
      </Card>

      {!isLast && (
        <div className="flex items-center mx-4">
          <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
      )}
    </div>
  );
}
