import { Column } from "../../../types";
export type { Column };

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: 0,
    title: "To Do",
    color: "bg-gray-50 dark:bg-gray-800/50",
    headerColor: "bg-gray-100 dark:bg-gray-700/50",
  },
  {
    id: 1,
    title: "In Progress",
    color: "bg-orange-50 dark:bg-orange-900/20",
    headerColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    id: 2,
    title: "In Review",
    color: "bg-blue-50 dark:bg-blue-900/20",
    headerColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: 3,
    title: "Done",
    color: "bg-green-50 dark:bg-green-900/20",
    headerColor: "bg-green-100 dark:bg-green-900/30",
  },
];
