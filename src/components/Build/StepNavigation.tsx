import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Step } from "../../types";

interface StepNavigationProps {
  currentStep: Step | null;
  allSteps: Step[];
  onStepChange: (stepId: string) => void;
}

export default function StepNavigation({
  currentStep,
  allSteps,
  onStepChange,
}: StepNavigationProps) {
  if (!currentStep) return null;

  const currentIndex = allSteps.findIndex((step) => step.id === currentStep.id);
  const previousStep = currentIndex > 0 ? allSteps[currentIndex - 1] : null;
  const nextStep =
    currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
      {/* Previous Step */}
      <div className="flex-1">
        {previousStep && (
          <motion.button
            onClick={() => onStepChange(previousStep.id)}
            className="flex items-center space-x-3 p-3 w-full lg:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="text-left">
              <div className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                Previous step
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {previousStep.title}
              </div>
            </div>
          </motion.button>
        )}
      </div>

      {/* Current Step Indicator */}
      <div className="flex-1 flex justify-center">
        <div className="inline-flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="text-center">
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
              Step {currentIndex + 1} of {allSteps.length}
            </div>
            <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              {currentStep.title}
            </div>
          </div>

          {/* Progress bar */}
          <div className="hidden sm:block w-24">
            <div className="bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / allSteps.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 text-center">
              {Math.round(((currentIndex + 1) / allSteps.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Next Step */}
      <div className="flex-1 flex justify-end">
        {nextStep && (
          <motion.button
            onClick={() => onStepChange(nextStep.id)}
            className="flex items-center space-x-3 p-3 w-full lg:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
                Next step
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {nextStep.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
