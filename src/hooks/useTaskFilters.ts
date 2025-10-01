import { useState, useEffect } from "react";
import { TaskFilters } from "../components/UI/TaskFilterBar";

/**
 * Custom hook to persist task filters in localStorage
 * This provides a better user experience by remembering filter preferences
 */
export function useTaskFilters(projectId: string) {
  const storageKey = `taskFilters_${projectId}`;

  const getInitialFilters = (): TaskFilters => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn("Failed to parse saved filters:", error);
    }

    return {
      searchTerm: "",
      myTasks: false,
      priority: [],
      categories: [],
    };
  };

  const [filters, setFilters] = useState<TaskFilters>(getInitialFilters);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters));
    } catch (error) {
      console.warn("Failed to save filters:", error);
    }
  }, [filters, storageKey]);

  return [filters, setFilters] as const;
}
