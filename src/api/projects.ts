import api from "./client";
import { Project } from "../types";

// Project API endpoints
export interface CreateProjectRequest {
  name: string;
  description?: string;
  ownerAddress: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

// Get all projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data;
};

// Get project by ID
export const getProject = async (id: string): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// Create new project (requires user address in headers)
export const createProject = async (
  data: CreateProjectRequest
): Promise<Project> => {
  const response = await api.post("/projects", data);
  return response.data;
};

// Update project (owner only)
export const updateProject = async (
  id: string,
  data: UpdateProjectRequest
): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

// Delete project (owner only)
export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
