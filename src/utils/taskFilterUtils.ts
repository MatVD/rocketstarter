import { Task, User as UserType } from "../types";
import { TaskFilters } from "../components/Build/TaskFilter";

/**
 * Utility function to filter tasks based on the provided filters
 */
export function filterTasks(
  tasks: Task[],
  filters: TaskFilters,
  user: UserType
): Task[] {
  return tasks.filter((task) => {
    // Filter by "My Tasks" - tasks assigned to current user
    if (filters.myTasks && task.assignee !== user.id) {
      return false;
    }

    // Filter by priority
    if (
      filters.priority.length > 0 &&
      !filters.priority.includes(task.priority || "")
    ) {
      return false;
    }

    // Filter by assignee
    if (
      filters.assignee.length > 0 &&
      !filters.assignee.includes(task.assignee)
    ) {
      return false;
    }

    // Note: Categories filter is project-level, not task-level
    // So we don't filter tasks by categories here
    // The categories filter is just for organizing/context

    return true;
  });
}

/**
 * Get the count of active filters
 */
export function getActiveFiltersCount(filters: TaskFilters): number {
  return (
    (filters.myTasks ? 1 : 0) +
    filters.priority.length +
    filters.categories.length +
    filters.assignee.length
  );
}
