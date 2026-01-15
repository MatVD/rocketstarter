/**
 * Calculate time remaining until due date
 * Returns a formatted string with color indicator
 */
export const getTimeRemaining = (dueDate: Date | string | undefined) => {
  if (!dueDate) return null;

  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)}d overdue`,
      color: "red",
      status: "overdue",
    };
  } else if (diffDays === 0) {
    return {
      text: "Due today",
      color: "red",
      status: "urgent",
    };
  } else if (diffDays === 1) {
    return {
      text: "Due tomorrow",
      color: "orange",
      status: "urgent",
    };
  } else if (diffDays <= 3) {
    return {
      text: `${diffDays} days left`,
      color: "orange",
      status: "warning",
    };
  } else if (diffDays <= 7) {
    return {
      text: `${diffDays} days left`,
      color: "yellow",
      status: "normal",
    };
  } else {
    return {
      text: `${diffDays} days left`,
      color: "green",
      status: "comfortable",
    };
  }
};

/**
 * Get Tailwind CSS classes for time remaining badge
 */
export const getTimeRemainingStyle = (status: string) => {
  switch (status) {
    case "overdue":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        border: "border-red-300 dark:border-red-800",
      };
    case "urgent":
      return {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        border: "border-orange-300 dark:border-orange-800",
      };
    case "warning":
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        border: "border-yellow-300 dark:border-yellow-800",
      };
    case "normal":
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-300 dark:border-blue-800",
      };
    case "comfortable":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-300 dark:border-green-800",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        border: "border-gray-300 dark:border-gray-700",
      };
  }
};
