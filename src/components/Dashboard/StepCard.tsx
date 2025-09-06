import React from "react";
import { motion } from "framer-motion";
import { Check, Clock, Circle } from "lucide-react";
import { Step } from "../../types";
import Card from "../UI/Card";

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
  const getStatusIcon = () => {
    switch (step.status) {
      case "completed":
        return <Check className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case "in-progress":
        return (
          <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400" />
        );
      default:
        return <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case "completed":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
      case "in-progress":
        return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            {getStatusIcon()}
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
            Terminer
          </motion.button>
        )}
      </div>
    </Card>
  );
}
