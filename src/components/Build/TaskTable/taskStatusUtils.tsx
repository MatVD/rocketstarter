import { Task } from "../../../types";

export const getStatusBadge = (status: Task["status"]) => {
  const styles = {
    todo: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300",
    "in-progress":
      "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400",
    done: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400",
  } as const;

  const labels = {
    todo: "To do",
    "in-progress": "In progress",
    done: "Done",
  } as const;

  // Provide fallback for dynamic status values
  const statusKey = status in styles ? (status as keyof typeof styles) : "todo";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[statusKey]}`}
    >
      {labels[statusKey]}
    </span>
  );
};
