import { COLORS } from "../constants/colors";

// Priority utilities for managing task priorities
export const PRIORITY_LEVELS = {
  0: { label: "Low", color: "blue" },
  1: { label: "Medium", color: "yellow" },
  2: { label: "High", color: "red" },
};

export const getPriorityLabel = (priority?: 0 | 1 | 2): string => {
  if (priority === undefined) return PRIORITY_LEVELS[0].label;
  return PRIORITY_LEVELS[priority]?.label || PRIORITY_LEVELS[0].label;
};

// Priority color mapping helper
export const getPriorityStyle = (priority?: 0 | 1 | 2) => {
  switch (priority) {
    case 0: // Low
      return {
        bg: COLORS.status.neutral.bg,
        text: COLORS.status.neutral.text,
        border: COLORS.status.neutral.border,
      };
    case 1: // Medium
      return {
        bg: COLORS.status.warning.bg,
        text: COLORS.status.warning.text,
        border: COLORS.status.warning.border,
      };
    case 2: // High
      return {
        bg: COLORS.status.error.bg,
        text: COLORS.status.error.text,
        border: COLORS.status.error.border,
      };
    default:
      return {
        bg: COLORS.status.neutral.bg,
        text: COLORS.status.neutral.text,
        border: COLORS.status.neutral.border,
      };
  }
}

export const getPriorityValue = (priorityLabel: string): 0 | 1 | 2 => {
  const entry = Object.entries(PRIORITY_LEVELS).find(
    ([, value]) => value.label.toLowerCase() === priorityLabel.toLowerCase()
  );
  return entry ? (parseInt(entry[0]) as 0 | 1 | 2) : 0;
};

export const getPriorityOptions = () => {
  return Object.entries(PRIORITY_LEVELS).map(([value, { label }]) => ({
    value: parseInt(value) as 0 | 1 | 2 | 3,
    label,
  }));
};

export const compareByPriority = (a: { priority?: number }, b: { priority?: number }) => {
  const priorityA = a.priority ?? 0;
  const priorityB = b.priority ?? 0;
  return priorityB - priorityA; // Higher priority first
};
