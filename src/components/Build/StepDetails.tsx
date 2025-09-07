import { motion } from "framer-motion";
import { Step } from "../../types";
import { getStepGuidelines } from "./StepDetails/stepGuidelinesData";
import {
  getStatusIcon,
  getStatusLabel,
  getStatusStyles,
} from "./StepDetails/stepStatusUtils";
import GuidelineSection from "./StepDetails/GuidelineSection";

interface StepDetailsProps {
  step: Step;
}

export default function StepDetails({ step }: StepDetailsProps) {
  const guidelines = getStepGuidelines(step.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
    >
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">{getStatusIcon(step.status)}</div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {step.description}
          </p>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
              step.status
            )}`}
          >
            {getStatusLabel(step.status)}
          </div>
        </div>
      </div>

      <GuidelineSection guidelines={guidelines} />
    </motion.div>
  );
}
