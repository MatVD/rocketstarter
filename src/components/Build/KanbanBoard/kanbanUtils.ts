import { Column } from "../../../types";
import { getKanbanColorPalette } from "../../../constants/colors";
export type { Column };

// Utilise la palette centralisée pour les nouvelles colonnes
const COLOR_PALETTE = getKanbanColorPalette();

// Fonction pour obtenir la prochaine couleur disponible
const getNextAvailableColor = (existingColumns: Column[]) => {
  // Récupérer les couleurs déjà utilisées par les colonnes personnalisées (exclut les 3 par défaut)
  const usedColors = existingColumns
    .filter((col) => !["todo", "in-progress", "done"].includes(col.id))
    .map((col) => col.color);

  // Trouver la première couleur non utilisée
  for (const colorSet of COLOR_PALETTE) {
    if (!usedColors.includes(colorSet.color)) {
      return colorSet;
    }
  }

  // Si toutes les couleurs sont utilisées, prendre la première (cycle)
  return COLOR_PALETTE[0];
};

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

export const createNewColumn = (existingColumns: Column[]): Column => {
  const colorSet = getNextAvailableColor(existingColumns);
  return {
    id: `col-${Date.now()}`,
    title: "Nouvelle colonne",
    color: colorSet.color,
    headerColor: colorSet.headerColor,
  };
};

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
