import { motion } from "framer-motion";
import { Step, Task } from "../../types";
import { getStepGuidelines } from "./StepDetails/stepGuidelinesData";
import {
  getStatusLabel,
  getStatusStyles,
} from "./StepDetails/stepStatusUtils";
import GuidelineSection from "./StepDetails/GuidelineSection";

interface StepDetailsProps {
  step: Step;
  tasks?: Task[];
}

export default function StepDetails({ step, tasks = [] }: StepDetailsProps) {
  const guidelines = getStepGuidelines(step.id);
  const stepTasks = tasks.filter((task) => task.stepId === step.id);
  const completedTasks = stepTasks.filter(
    (task) => task.status === "done"
  ).length;
  const totalTasks = stepTasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
    >
      <div className="flex items-start space-x-4 mb-6">
        {/* <div className="flex-shrink-0">{getStatusIcon(step.status)}</div> */}
        <div className="flex-1">
          <h3 className="flex justify-center text-xl gap-2 font-semibold text-gray-900 dark:text-white mb-2">
            {step.title}  <div
              className={`inline-flex items-center p-1 rounded-lg text-xs font-medium ${getStatusStyles(
                step.status
              )}`}
            >
              {getStatusLabel(step.status)}
            </div>
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Main objectives: {step.description}
          </p>
          <div className="flex items-center space-x-4">
            
            {totalTasks > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {completedTasks}/{totalTasks} tasks completed
              </div>
            )}
          </div>
        </div>
      </div>

      <GuidelineSection guidelines={guidelines} />
    </motion.div>
  );
}
