// src/stores/useProjectStore.ts
import { create } from "zustand";
import { Project } from "../types";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../api";

interface ProjectState {
  // Projects
  projects: Project[];
  selectedProject: Project | null;
  projectsLoading: boolean;
  projectsError: string | null;

  // Projects actions
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createNewProject: (data: CreateProjectRequest) => Promise<Project | null>;
  updateExistingProject: (
    id: string,
    data: UpdateProjectRequest
  ) => Promise<Project | null>;
  removeProject: (id: string) => Promise<boolean>;
  setSelectedProject: (project: Project | null) => void;
  refetchProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  selectedProject: null,
  projectsLoading: false,
  projectsError: null,

  // Projects actions
  fetchProjects: async () => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const data = await getProjects();
      set({ projects: data, projectsLoading: false });
    } catch (err) {
      set({
        projectsError:
          err instanceof Error ? err.message : "Failed to fetch projects",
        projectsLoading: false,
      });
    }
  },

  fetchProject: async (id: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const data = await getProject(id);
      set({ selectedProject: data, projectsLoading: false });
    } catch (err) {
      set({
        projectsError:
          err instanceof Error ? err.message : "Failed to fetch project",
        projectsLoading: false,
      });
    }
  },

  createNewProject: async (data: CreateProjectRequest) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const project = await createProject(data);
      set((state) => ({
        projects: [...state.projects, project],
        projectsLoading: false,
      }));
      return project;
    } catch (err) {
      set({
        projectsError:
          err instanceof Error ? err.message : "Failed to create project",
        projectsLoading: false,
      });
      return null;
    }
  },

  updateExistingProject: async (id: string, data: UpdateProjectRequest) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const updatedProject = await updateProject(id, data);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === parseInt(id) ? updatedProject : p
        ),
        selectedProject:
          state.selectedProject?.id === parseInt(id)
            ? updatedProject
            : state.selectedProject,
        projectsLoading: false,
      }));
      return updatedProject;
    } catch (err) {
      set({
        projectsError:
          err instanceof Error ? err.message : "Failed to update project",
        projectsLoading: false,
      });
      return null;
    }
  },

  removeProject: async (id: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      await deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== parseInt(id)),
        projectsLoading: false,
      }));
      return true;
    } catch (err) {
      set({
        projectsError:
          err instanceof Error ? err.message : "Failed to delete project",
        projectsLoading: false,
      });
      return false;
    }
  },

  setSelectedProject: (project) => set({ selectedProject: project }),

  refetchProjects: async () => {
    const { fetchProjects } = get();
    await fetchProjects();
  },
}));
