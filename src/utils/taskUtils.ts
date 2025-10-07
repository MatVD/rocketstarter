import { Task } from "../types";

/**
 * Convert task status string to API number format
 */
export const statusToNumber = (status: string): 0 | 1 | 2 | 3 => {
  switch (status) {
    case "todo":
      return 0;
    case "in-progress":
      return 1;
    case "in-review":
      return 2;
    case "done":
      return 3;
    default:
      return 0;
  }
};

/**
 * Convert priority number to API format with bounds checking
 */
export const priorityToNumber = (priority: number): 0 | 1 | 2 | 3 => {
  return Math.max(0, Math.min(3, priority)) as 0 | 1 | 2 | 3;
};

/**
 * Convert API number status back to string
 */
export const numberToStatus = (status: number): Task["status"] => {
  switch (status) {
    case 0:
      return "todo";
    case 1:
      return "in-progress";
    case 2:
      return "in-review";
    case 3:
      return "done";
    default:
      return "todo";
  }
};

/**
 * Filter tasks by step ID
 */
export const getTasksByStep = (tasks: Task[], stepId: string): Task[] => {
  return tasks.filter((task) => task.stepId === stepId);
};

/**
 * Filter tasks by status
 */
export const getTasksByStatus = (tasks: Task[], status: string): Task[] => {
  return tasks.filter((task) => task.status === status);
};
