import { CheckCircle, Clock, Circle, Check } from "lucide-react";
import { Step } from "../types";
import { ReactElement } from "react";

/**
 * Centralized status utilities for consistent status handling across components
 */

export const getStatusIcon = (
  status: Step["status"],
  variant: "default" | "flow" = "default"
): ReactElement => {
  const baseClasses = variant === "flow" ? "w-5 h-5 text-white" : "w-5 h-5";

  switch (status) {
    case "completed": {
      const CompletedIcon = variant === "flow" ? Check : CheckCircle;
      return (
        <CompletedIcon
          className={
            variant === "flow"
              ? baseClasses
              : `${baseClasses} text-green-600 dark:text-green-400`
          }
        />
      );
    }
    case "in-progress":
      return (
        <Clock
          className={
            variant === "flow"
              ? baseClasses
              : `${baseClasses} text-orange-600 dark:text-orange-400`
          }
        />
      );
    default:
      return (
        <Circle
          className={
            variant === "flow" ? baseClasses : `${baseClasses} text-gray-400`
          }
        />
      );
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
      return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800";
    case "in-progress":
      return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800";
  }
};

export const getStatusColor = (
  status: Step["status"],
  type: "background" | "border" = "background"
): string => {
  if (type === "background") {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  } else {
    switch (status) {
      case "completed":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20";
      case "in-progress":
        return "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20";
      default:
        return "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800";
    }
  }
};

export const getBorderColor = (status: Step["status"]): string => {
  switch (status) {
    case "completed":
      return "border-green-200 dark:border-green-800";
    case "in-progress":
      return "border-orange-200 dark:border-orange-800";
    default:
      return "border-gray-200 dark:border-gray-700";
  }
};
