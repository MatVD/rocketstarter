import React from "react";
import { motion } from "framer-motion";
import { Check, Clock, Circle, ArrowRight } from "lucide-react";
import { Step } from "../../types";
import Card from "../UI/Card";

interface FlowStepProps {
  step: Step;
  isLast?: boolean;
  onDetails: (stepId: string) => void;
}

export default function FlowStep({
  step,
  isLast = false,
  onDetails,
}: FlowStepProps) {
  const getStatusIcon = () => {
    switch (step.status) {
      case "completed":
        return <Check className="w-5 h-5 text-white" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-white" />;
      default:
        return <Circle className="w-5 h-5 text-white" />;
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  const getBorderColor = () => {
    switch (step.status) {
      case "completed":
        return "border-green-200 dark:border-green-800";
      case "in-progress":
        return "border-orange-200 dark:border-orange-800";
      default:
        return "border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="flex items-center">
      <Card
        hover
        className={`p-3 md:p-4 min-w-[250px] md:min-w-[280px] border-2 ${getBorderColor()}`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              {step.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {step.description}
            </p>
            <motion.button
              onClick={() => onDetails(step.id)}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Voir détails →
            </motion.button>
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
