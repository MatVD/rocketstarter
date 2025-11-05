import { Task } from "../../../../types";

export const getStatusBadge = (status: Task["status"]) => {
  const statusString = String(status);

  // Default styles based on column ID - using soft colors consistent with design
  const getDefaultStylesByColumnId = (statusString: string) => {
    switch (statusString) {
      case "0":
        return {
          style:
            "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800",
          label: "To Do",
        };
      case "1":
        return {
          style:
            "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
          label: "In Progress",
        };
      case "2":
        return {
          style:
            "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
          label: "In Review",
        };
      case "3":
        return {
          style:
            "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800",
          label: "Done",
        };
      default:
        return null;
    }
  };

  // Check if it's a default column (0-3)
  const defaultStyle = getDefaultStylesByColumnId(statusString);
  if (defaultStyle) {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${defaultStyle.style}`}
      >
        {defaultStyle.label}
      </span>
    );
  }
};
