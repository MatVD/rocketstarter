import { useState, useEffect } from "react";
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

// Hook for fetching all projects
export const useProjectStore = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const refetch = () => {
    fetchProjects();
  };

  return { projects, loading, error, refetch };
};

// Hook for fetching a single project
export const useProject = (id: string | null) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProject(null);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProject(id);
        setProject(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch project"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
};

// Hook for project CRUD operations
export const useProjectMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (
    data: CreateProjectRequest
  ): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      const project = await createProject(data);
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    id: string,
    data: UpdateProjectRequest
  ): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      const project = await updateProject(id, data);
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await deleteProject(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
};
