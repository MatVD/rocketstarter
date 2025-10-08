import { useProjects } from "./useProjects";
import { useTasks } from "./useTasks";
import { mockProjects, mockUser, tasks as mockTasks } from "../data/mockData";

export const useAppData = () => {
  const {
    projects: backendProjects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();
  const {
    tasks: backendTasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks();

  // Use backend data if available, fallback to mock data
  const projects = backendProjects.length > 0 ? backendProjects : mockProjects;
  const tasks = backendTasks.length > 0 ? backendTasks : mockTasks;
  const user = mockUser; // User data stays local for now

  return {
    projects,
    tasks,
    user,
    loading: projectsLoading || tasksLoading,
    error: projectsError || tasksError,
  };
};
