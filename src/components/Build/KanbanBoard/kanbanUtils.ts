import { Column } from "./KanbanColumnHeader";

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-gray-100 dark:bg-gray-800",
    headerColor: "bg-gray-200 dark:bg-gray-700",
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-orange-50 dark:bg-orange-900/10",
    headerColor: "bg-orange-100 dark:bg-orange-900/20",
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-50 dark:bg-green-900/10",
    headerColor: "bg-green-100 dark:bg-green-900/20",
  },
];

export const createNewColumn = (): Column => ({
  id: `col-${Date.now()}`,
  title: "Nouvelle colonne",
  color: "bg-gray-50 dark:bg-gray-900/10",
  headerColor: "bg-gray-200 dark:bg-gray-700",
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
