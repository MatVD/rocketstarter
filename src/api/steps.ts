import api from "./client";
import { Step, CreateStepRequest, UpdateStepRequest } from "../types";

// Get all steps
export const getSteps = async (): Promise<Step[]> => {
  const response = await api.get("/steps");
  return response.data;
};

// Get my steps (steps where the authenticated user is involved)
export const getMySteps = async (): Promise<Step[]> => {
  const response = await api.get("/steps/my");
  return response.data;
};

// Get steps by project ID
export const getStepsByProject = async (projectId: string): Promise<Step[]> => {
  const response = await api.get(`/steps/project/${projectId}`);
  return response.data;
};

// Get step by ID
export const getStep = async (id: string): Promise<Step> => {
  const response = await api.get(`/steps/${id}`);
  return response.data;
};

// Create new step
export const createStep = async (data: CreateStepRequest): Promise<Step> => {
  const response = await api.post("/steps", data);
  return response.data;
};

// Update step
export const updateStep = async (
  id: string,
  data: UpdateStepRequest
): Promise<Step> => {
  const response = await api.put(`/steps/${id}`, data);
  return response.data;
};

// Update step status (convenience method)
export const updateStepStatus = async (
  id: string,
  status: "todo" | "in-progress" | "completed"
): Promise<Step> => {
  return updateStep(id, { status: status === "todo" ? 0 : status === "in-progress" ? 1 : 2 });
};

// Delete step
export const deleteStep = async (id: string): Promise<void> => {
  await api.delete(`/steps/${id}`);
};
