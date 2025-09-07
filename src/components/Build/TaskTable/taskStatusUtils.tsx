import { Task } from "../../../types";
import type { Column } from "../KanbanBoard/kanbanUtils";

export const getStatusBadge = (status: Task["status"], columns: Column[]) => {
  // Try to find the column for this status
  const column = columns.find((col) => col.id === status);

  // Default styles for known statuses - using soft colors consistent with design
  const defaultStyles = {
    todo: "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300",
    "in-progress":
      "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
    done: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
  } as const;

  const defaultLabels = {
    todo: "To do",
    "in-progress": "In progress",
    done: "Done",
  } as const;

  // If it's a default status, use predefined styles
  if (status in defaultStyles) {
    const statusKey = status as keyof typeof defaultStyles;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${defaultStyles[statusKey]}`}
      >
        {defaultLabels[statusKey]}
      </span>
    );
  }

  // For custom columns, use a soft blue style consistent with design
  const customStyle =
    "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300";
  const label = column?.title || status;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${customStyle}`}
    >
      {label}
    </span>
  );
};
