import { Column } from "./KanbanColumnHeader";
export type { Column };

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-gray-50 dark:bg-gray-800/50",
    headerColor: "bg-gray-100 dark:bg-gray-700/50",
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-orange-50 dark:bg-orange-900/20",
    headerColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-50 dark:bg-green-900/20",
    headerColor: "bg-green-100 dark:bg-green-900/30",
  },
];
export const createNewColumn = (): Column => ({
  id: `col-${Date.now()}`,
  title: "Nouvelle colonne",
  color: "bg-blue-50 dark:bg-blue-900/20",
  headerColor: "bg-blue-100 dark:bg-blue-900/30",
});

export const updateColumn = (
  columns: Column[],
  id: string,
  title: string
): Column[] => {
  return columns.map((col) => (col.id === id ? { ...col, title } : col));
};

export const deleteColumn = (columns: Column[], id: string): Column[] => {
  return columns.filter((col) => col.id !== id);
};
