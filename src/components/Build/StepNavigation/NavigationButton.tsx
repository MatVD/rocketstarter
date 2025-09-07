import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Step } from "../../../types";

interface NavigationButtonProps {
  step: Step;
  direction: "previous" | "next";
  onClick: () => void;
}

export default function NavigationButton({
  step,
  direction,
  onClick,
}: NavigationButtonProps) {
  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ChevronLeft : ChevronRight;

  return (
    <motion.button
      onClick={onClick}
      className="flex items-center space-x-3 p-3 w-full lg:w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isPrevious && (
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      )}
      <div className={isPrevious ? "text-left" : "text-right"}>
        <div className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">
          {isPrevious ? "Previous step" : "Next step"}
        </div>
        <div className="font-medium text-gray-900 dark:text-white">
          {step.title}
        </div>
      </div>
      {!isPrevious && (
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      )}
    </motion.button>
  );
}
