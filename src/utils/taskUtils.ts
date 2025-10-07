import { Task } from "../types";

/**
 * Convert priority number to API format with bounds checking
 * New schema: 0=low, 1=medium, 2=high
 */
export const priorityToNumber = (priority: number): 0 | 1 | 2 => {
  return Math.max(0, Math.min(2, priority)) as 0 | 1 | 2;
};

/**
 * Convert API number status back to string
 * New schema: 0=todo, 1=inprogress, 2=inreview, 3=done
 */
export const numberToStatus = (status: number): string => {
  console.log("Converting status number to string:", status);
  let result: string;

  switch (status) {
    case 0:
      result = "0"; // Maintenant utilisé comme ID de colonne
      break;
    case 1:
      result = "1";
      break;
    case 2:
      result = "2";
      break;
    case 3:
      result = "3";
      break;
    default:
      console.warn(`Unexpected status value: ${status}, defaulting to 0`);
      result = "0";
  }

  console.log("Status converted to:", result);
  return result;
};

/**
 * Filter tasks by step ID
 */
export const getTasksByStep = (tasks: Task[], stepId?: number): Task[] => {
  console.log("getTasksByStep called with:", { tasks, stepId });
  if (!stepId) return [];
  if (!tasks || !Array.isArray(tasks)) return [];

  const filteredTasks = tasks.filter((task) => {
    // Convertir les deux en nombres pour comparer
    const taskStepId = task.stepId ? Number(task.stepId) : undefined;
    return taskStepId === Number(stepId);
  });

  console.log("Filtered tasks by step:", filteredTasks);
  return filteredTasks;
};

/**
 * Filter tasks by status
 */
export const getTasksByStatus = (tasks: Task[], status: string): Task[] => {
  return tasks.filter((task) => numberToStatus(task.status) === status);
};

/**
 * Convert string status to API number format
 */
export const statusToNumber = (status: string): 0 | 1 | 2 | 3 => {
  console.log("Converting status string to number:", status);
  let result: 0 | 1 | 2 | 3;

  // Si c'est déjà un nombre comme chaîne ("0", "1", "2", "3")
  if (/^[0-3]$/.test(status)) {
    result = Number(status) as 0 | 1 | 2 | 3;
  } else {
    // Sinon, on utilise les chaînes descriptives
    switch (status.toLowerCase()) {
      case "todo":
        result = 0;
        break;
      case "inprogress":
      case "in-progress":
        result = 1;
        break;
      case "inreview":
      case "review":
      case "in-review":
        result = 2;
        break;
      case "done":
        result = 3;
        break;
      default:
        console.warn(`Unexpected status string: ${status}, defaulting to 0`);
        result = 0; // Default to todo
    }
  }

  console.log("Status converted to number:", result);
  return result;
};
