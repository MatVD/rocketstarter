import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Step, Task } from "../../../types";
import { getStepGuidelines } from "../StepDetails/stepGuidelinesData";
import { getStatusLabel, getStatusStyles } from "../../../utils/statusUtils";
import GuidelineSection from "./GuidelineSection";

interface StepDetailsProps {
  step: Step;
  tasks?: Task[];
}

export default function StepDetails({ step, tasks = [] }: StepDetailsProps) {
  const [isObjectivesExpanded, setIsObjectivesExpanded] = useState(false);
  const guidelines = getStepGuidelines(step.id);
  const stepTasks = tasks.filter((task) => task.stepId === step.id);
  const completedTasks = stepTasks.filter(
    (task) => task.status === 3 // 3 represents "Done" status
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
            {step.title}{" "}
            <div
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

      {/* Collapsible Objectives Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={() => setIsObjectivesExpanded(!isObjectivesExpanded)}
          className="flex items-center space-x-2 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors"
        >
          {isObjectivesExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
          <span className="font-semibold text-gray-900 dark:text-white">
            Step Objectives & Guidelines
          </span>
        </button>

        <AnimatePresence>
          {isObjectivesExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <GuidelineSection guidelines={guidelines} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
