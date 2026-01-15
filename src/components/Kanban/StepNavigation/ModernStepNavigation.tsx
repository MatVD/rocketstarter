import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { Step } from "../../../types";
import { COLORS } from "../../../constants/colors";

interface ModernStepNavigationProps {
  steps: Step[];
  currentStepId: number | null;
  onStepChange: (stepId: number) => void;
}

export default function ModernStepNavigation({
  steps,
  currentStepId,
  onStepChange,
}: ModernStepNavigationProps) {
  if (steps.length === 0) return null;

  const currentIndex = steps.findIndex((step) => step.id === currentStepId);
  const selectedIndex = currentIndex !== -1 ? currentIndex : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Project Workflow
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Navigate through project steps
        </p>
      </div>

      {/* Steps Timeline - Horizontal Scroll */}
      <div className="relative">
        {/* Progress Line Background - Above Steps */}
        <div className="mb-8 hidden md:block">
          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Progress Line Fill */}
            <div
              className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
              style={{
                width: `${(selectedIndex / Math.max(steps.length - 1, 1)) * 100}%`,
              }}
            />
          </div>
          {/* Step Indicators on Progress Bar */}
          <div className="relative flex justify-between -mt-3">
            {steps.map((step, index) => {
              const isActive = step.id === currentStepId;
              const isPast = index < selectedIndex;
              return (
                <div
                  key={`indicator-${step.id}`}
                  className={`
                    w-4 h-4 rounded-full border-2 bg-white dark:bg-gray-800
                    ${
                      isActive
                        ? 'border-blue-600 dark:border-blue-400'
                        : isPast
                        ? 'border-green-600 dark:border-green-400 bg-green-600 dark:bg-green-400'
                        : 'border-gray-400 dark:border-gray-600'
                    }
                  `}
                />
              );
            })}
          </div>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 relative">
          {steps.map((step, index) => {
            const isActive = step.id === currentStepId;
            const isCompleted = step.progress === 100;
            const isPast = index < selectedIndex;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex-1 min-w-0"
              >
                <button
                  onClick={() => onStepChange(step.id)}
                  className={`
                    w-full relative group
                    ${isActive ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  {/* Step Card */}
                  <div
                    className={`
                      relative rounded-lg p-4 transition-all duration-300
                      border-2
                      ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 shadow-lg scale-105'
                          : isPast || isCompleted
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400 hover:shadow-md'
                          : 'bg-gray-50 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600 hover:shadow-md hover:border-blue-300'
                      }
                    `}
                  >
                    {/* Step Number/Icon */}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`
                          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                          transition-all duration-300
                          ${
                            isActive
                              ? 'bg-blue-600 dark:bg-blue-500 text-white'
                              : isCompleted
                              ? 'bg-green-600 dark:bg-green-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }
                        `}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Circle className={`w-4 h-4 ${isActive ? 'fill-white' : ''}`} />
                        )}
                      </div>

                      {/* Step Name */}
                      <h4
                        className={`
                          font-semibold text-sm truncate
                          ${
                            isActive
                              ? 'text-blue-900 dark:text-blue-100'
                              : isCompleted
                              ? 'text-green-900 dark:text-green-100'
                              : 'text-gray-900 dark:text-gray-100'
                          }
                        `}
                      >
                        {step.name}
                      </h4>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`
                            ${
                              isActive
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-gray-600 dark:text-gray-400'
                            }
                          `}
                        >
                          Progress
                        </span>
                        <span
                          className={`
                            font-semibold
                            ${
                              isActive
                                ? 'text-blue-900 dark:text-blue-100'
                                : isCompleted
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }
                          `}
                        >
                          {Math.round(step.progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${step.progress}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`
                            h-full rounded-full transition-colors
                            ${
                              isCompleted
                                ? 'bg-green-600 dark:bg-green-500'
                                : 'bg-blue-600 dark:bg-blue-500'
                            }
                          `}
                        />
                      </div>
                    </div>

                    {/* Active Indicator Pulse */}
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      {currentStepId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Current step:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {steps.find((s) => s.id === currentStepId)?.name}
              </span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Step {selectedIndex + 1} of {steps.length}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
