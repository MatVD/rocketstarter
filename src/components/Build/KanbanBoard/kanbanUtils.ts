import { Column } from "./KanbanColumnHeader";
export type { Column };

// Palette de couleurs pour les nouvelles colonnes
const COLOR_PALETTE = [
  {
    color: "bg-blue-50 dark:bg-blue-900/20",
    headerColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    color: "bg-purple-50 dark:bg-purple-900/20",
    headerColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    color: "bg-pink-50 dark:bg-pink-900/20",
    headerColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    headerColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    color: "bg-cyan-50 dark:bg-cyan-900/20",
    headerColor: "bg-cyan-100 dark:bg-cyan-900/30",
  },
  {
    color: "bg-teal-50 dark:bg-teal-900/20",
    headerColor: "bg-teal-100 dark:bg-teal-900/30",
  },
  {
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    headerColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    color: "bg-lime-50 dark:bg-lime-900/20",
    headerColor: "bg-lime-100 dark:bg-lime-900/30",
  },
  {
    color: "bg-yellow-50 dark:bg-yellow-900/20",
    headerColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    color: "bg-amber-50 dark:bg-amber-900/20",
    headerColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    color: "bg-red-50 dark:bg-red-900/20",
    headerColor: "bg-red-100 dark:bg-red-900/30",
  },
  {
    color: "bg-rose-50 dark:bg-rose-900/20",
    headerColor: "bg-rose-100 dark:bg-rose-900/30",
  },
  {
    color: "bg-slate-50 dark:bg-slate-900/20",
    headerColor: "bg-slate-100 dark:bg-slate-900/30",
  },
  {
    color: "bg-zinc-50 dark:bg-zinc-900/20",
    headerColor: "bg-zinc-100 dark:bg-zinc-900/30",
  },
  {
    color: "bg-stone-50 dark:bg-stone-900/20",
    headerColor: "bg-stone-100 dark:bg-stone-900/30",
  },
];

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
