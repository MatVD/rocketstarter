import { CheckCircle, Clock, Circle } from "lucide-react";
import { Step } from "../../../types";
import { ReactElement } from "react";

export const getStatusIcon = (status: Step["status"]): ReactElement => {
  switch (status) {
    case "completed":
      return (
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      );
    case "in-progress":
      return (
        <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      );
    default:
      return <Circle className="w-5 h-5 text-gray-400" />;
  }
};

export const getStatusLabel = (status: Step["status"]): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    default:
      return "To Do";
  }
};

export const getStatusStyles = (status: Step["status"]): string => {
  switch (status) {
    case "completed":
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200";
    case "in-progress":
      return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
  }
};
