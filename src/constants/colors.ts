/**
 * Centralized color constants for consistent theming throughout the app
 * Using Tailwind CSS class names for consistency with the design system
 */

export const COLORS = {
  // Primary colors
  primary: {
    50: "bg-blue-50 dark:bg-blue-900/20",
    100: "bg-blue-100 dark:bg-blue-900/30",
    500: "bg-blue-500",
    600: "bg-blue-600",
    700: "bg-blue-700",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },

  // Status colors
  status: {
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-800 dark:text-green-200",
      border: "border-green-200 dark:border-green-800",
      button: "bg-green-600 hover:bg-green-700",
      icon: "text-green-600 dark:text-green-400",
    },
    warning: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-800 dark:text-orange-200",
      border: "border-orange-200 dark:border-orange-800",
      button: "bg-orange-600 hover:bg-orange-700",
      icon: "text-orange-600 dark:text-orange-400",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-800 dark:text-red-200",
      border: "border-red-200 dark:border-red-800",
      button: "bg-red-600 hover:bg-red-700",
      icon: "text-red-600 dark:text-red-400",
    },
    neutral: {
      bg: "bg-gray-50 dark:bg-gray-800",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-gray-200 dark:border-gray-700",
      button: "bg-gray-500 hover:bg-gray-600",
      icon: "text-gray-400",
    },
  },

  // Text colors
  text: {
    primary: "text-gray-900 dark:text-white",
    secondary: "text-gray-600 dark:text-gray-400",
    muted: "text-gray-500 dark:text-gray-400",
    inverse: "text-white dark:text-gray-900",
  },

  // Background colors
  background: {
    primary: "bg-white dark:bg-gray-900",
    secondary: "bg-gray-50 dark:bg-gray-800",
    tertiary: "bg-gray-100 dark:bg-gray-800",
    card: "bg-white dark:bg-gray-800",
    overlay: "bg-gray-50 dark:bg-gray-800/50",
  },

  // Border colors
  border: {
    primary: "border-gray-200 dark:border-gray-700",
    secondary: "border-gray-100 dark:border-gray-800",
    focus: "border-blue-500 dark:border-blue-400",
  },

  // Form colors
  form: {
    input: {
      bg: "bg-white dark:bg-gray-700",
      border: "border-gray-300 dark:border-gray-600",
      text: "text-gray-900 dark:text-white",
      placeholder: "placeholder-gray-500 dark:placeholder-gray-400",
      focus: "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    },
    label: "text-gray-700 dark:text-gray-300",
    error: "text-red-600 dark:text-red-400",
    success: "text-green-600 dark:text-green-400",
  },

  // Button variants
  button: {
    primary:
      "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  },

  // Kanban column colors palette
  kanban: {
    blue: {
      color: "bg-blue-50 dark:bg-blue-900/20",
      headerColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    purple: {
      color: "bg-purple-50 dark:bg-purple-900/20",
      headerColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    pink: {
      color: "bg-pink-50 dark:bg-pink-900/20",
      headerColor: "bg-pink-100 dark:bg-pink-900/30",
      textColor: "text-pink-700 dark:text-pink-300",
    },
    indigo: {
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      headerColor: "bg-indigo-100 dark:bg-indigo-900/30",
      textColor: "text-indigo-700 dark:text-indigo-300",
    },
    cyan: {
      color: "bg-cyan-50 dark:bg-cyan-900/20",
      headerColor: "bg-cyan-100 dark:bg-cyan-900/30",
      textColor: "text-cyan-700 dark:text-cyan-300",
    },
    teal: {
      color: "bg-teal-50 dark:bg-teal-900/20",
      headerColor: "bg-teal-100 dark:bg-teal-900/30",
      textColor: "text-teal-700 dark:text-teal-300",
    },
    emerald: {
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      headerColor: "bg-emerald-100 dark:bg-emerald-900/30",
      textColor: "text-emerald-700 dark:text-emerald-300",
    },
    lime: {
      color: "bg-lime-50 dark:bg-lime-900/20",
      headerColor: "bg-lime-100 dark:bg-lime-900/30",
      textColor: "text-lime-700 dark:text-lime-300",
    },
    yellow: {
      color: "bg-yellow-50 dark:bg-yellow-900/20",
      headerColor: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-700 dark:text-yellow-300",
    },
    amber: {
      color: "bg-amber-50 dark:bg-amber-900/20",
      headerColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-700 dark:text-amber-300",
    },
    red: {
      color: "bg-red-50 dark:bg-red-900/20",
      headerColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-700 dark:text-red-300",
    },
    rose: {
      color: "bg-rose-50 dark:bg-rose-900/20",
      headerColor: "bg-rose-100 dark:bg-rose-900/30",
      textColor: "text-rose-700 dark:text-rose-300",
    },
    slate: {
      color: "bg-slate-50 dark:bg-slate-900/20",
      headerColor: "bg-slate-100 dark:bg-slate-900/30",
      textColor: "text-slate-700 dark:text-slate-300",
    },
    zinc: {
      color: "bg-zinc-50 dark:bg-zinc-900/20",
      headerColor: "bg-zinc-100 dark:bg-zinc-900/30",
      textColor: "text-zinc-700 dark:text-zinc-300",
    },
    stone: {
      color: "bg-stone-50 dark:bg-stone-900/20",
      headerColor: "bg-stone-100 dark:bg-stone-900/30",
      textColor: "text-stone-700 dark:text-stone-300",
    },
  },
} as const;

/**
 * Utility function to get Kanban column colors by name
 */
export const getKanbanColor = (colorName: keyof typeof COLORS.kanban) => {
  return COLORS.kanban[colorName] || COLORS.kanban.blue;
};

/**
 * Get all available Kanban color options
 */
export const getKanbanColorPalette = () => {
  return Object.entries(COLORS.kanban).map(([name, colors]) => ({
    name,
    ...colors,
  }));
};

/**
 * Get status color scheme
 */
export const getStatusColor = (
  status: "success" | "warning" | "error" | "neutral"
) => {
  return COLORS.status[status];
};

/**
 * Common class combinations
 */
export const COMMON_CLASSES = {
  card: `${COLORS.background.card} ${COLORS.border.primary} border rounded-lg`,
  input: `${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} ${COLORS.form.input.focus} border rounded-lg px-3 py-2`,
  button: {
    primary: `${COLORS.button.primary} px-4 py-2 rounded-lg transition-colors`,
    secondary: `${COLORS.button.secondary} px-4 py-2 rounded-lg transition-colors`,
    success: `${COLORS.button.success} px-4 py-2 rounded-lg transition-colors`,
    danger: `${COLORS.button.danger} px-4 py-2 rounded-lg transition-colors`,
    ghost: `${COLORS.button.ghost} px-4 py-2 rounded-lg transition-colors`,
  },
  text: {
    heading: `${COLORS.text.primary} font-semibold`,
    body: `${COLORS.text.secondary}`,
    muted: `${COLORS.text.muted} text-sm`,
  },
} as const;
