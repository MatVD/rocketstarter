import { useProjects } from "./useProjects";
import { useTasks } from "./useTasks";
import { mockProjects, tasks as mockTasks } from "../data/mockData";

/**
 * Generic hook for backend data with fallback logic
 */
function useBackendData<T>(
  backendData: T[],
  mockData: T[],
  loading: boolean,
  error: string | null
) {
  return {
    data: loading ? mockData : backendData.length > 0 ? backendData : mockData,
    loading: loading,
    error: error,
    isEmpty: !loading && !error && backendData.length === 0,
  };
}

/**
 * Hook for projects with unified data access pattern
 */
export const useProjectsData = () => {
  const { projects, loading, error, refetch } = useProjects();

  return {
    ...useBackendData(
      projects,
      mockProjects,
      loading,
      error
    ),
    refetch,
  };
};

/**
 * Hook for tasks with unified data access pattern
 */
export const useTasksData = (projectId?: string) => {
  const { tasks, loading, error, refetch } = useTasks(projectId);

  return {
    ...useBackendData(tasks, mockTasks, loading, error),
    refetch,
  };
};

/**
 * Hook for a specific project
 */
export const useProjectData = (projectId: string | null) => {
  const { data: projects, ...rest } = useProjectsData();
  const project = projectId ? projects.find((p) => p.id === projectId) : null;

  return {
    project,
    projects,
    ...rest,
  };
};
