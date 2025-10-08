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
  let result: string;

  switch (status) {
    case 0:
      result = "0";
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
      result = "0";
  }
  return result;
};

/**
 * Filter tasks by step ID
 */
export const getTasksByStep = (tasks: Task[], stepId?: number): Task[] => {
  if (!stepId) return [];
  if (!tasks || !Array.isArray(tasks)) return [];

  const filteredTasks = tasks.filter((task) => {
    const taskStepId = task.stepId ? Number(task.stepId) : undefined;
    return taskStepId === Number(stepId);
  });

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
  let result: 0 | 1 | 2 | 3;

  if (/^[0-3]$/.test(status)) {
    result = Number(status) as 0 | 1 | 2 | 3;
  } else {
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
        result = 0;
    }
  }

  return result;
};
