import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  stepTitles,
}: StepIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <motion.div
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full
                  border-2 transition-all duration-300
                  ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white scale-110"
                      : isCompleted
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500"
                  }
                `}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <span className="font-semibold">{stepNumber}</span>
                )}

                {/* Active Pulse */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-400"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.div>

              {/* Step Title */}
              <motion.p
                className={`
                  mt-2 text-sm font-medium text-center transition-colors
                  ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : isCompleted
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                `}
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
              >
                {title}
              </motion.p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
