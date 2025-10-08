import api from "./client";
import { Step, ApiStep, CreateStepRequest, UpdateStepRequest } from "../types";

// Transform API response to frontend format
const transformStep = (apiStep: ApiStep): Step => {
  const statusMap: Record<0 | 1 | 2, "todo" | "in-progress" | "completed"> = {
    0: "todo",
    1: "in-progress",
    2: "completed",
  };

  return {
    id: apiStep.id.toString(),
    title: apiStep.title,
    description: apiStep.description || "",
    projectId: apiStep.projectId.toString(),
    order: apiStep.order,
    status: statusMap[apiStep.status],
    completed: apiStep.status === 2,
  };
};

// Transform frontend status to API format
const transformStatus = (
  status: "todo" | "in-progress" | "completed"
): 0 | 1 | 2 => {
  const statusMap: Record<"todo" | "in-progress" | "completed", 0 | 1 | 2> = {
    todo: 0,
    "in-progress": 1,
    completed: 2,
  };
  return statusMap[status];
};

// Get all steps
export const getSteps = async (): Promise<Step[]> => {
  const response = await api.get("/steps");
  return response.data.map(transformStep);
};

// Get my steps (steps where the authenticated user is involved)
export const getMySteps = async (): Promise<Step[]> => {
  const response = await api.get("/steps/my");
  return response.data.map(transformStep);
};

// Get steps by project ID
export const getStepsByProject = async (projectId: string): Promise<Step[]> => {
  const response = await api.get(`/steps/project/${projectId}`);
  return response.data.map(transformStep);
};

// Get step by ID
export const getStep = async (id: string): Promise<Step> => {
  const response = await api.get(`/steps/${id}`);
  return transformStep(response.data);
};

// Create new step
export const createStep = async (data: CreateStepRequest): Promise<Step> => {
  const response = await api.post("/steps", data);
  return transformStep(response.data);
};

// Update step
export const updateStep = async (
  id: string,
  data: UpdateStepRequest
): Promise<Step> => {
  const response = await api.put(`/steps/${id}`, data);
  return transformStep(response.data);
};

// Update step status (convenience method)
export const updateStepStatus = async (
  id: string,
  status: "todo" | "in-progress" | "completed"
): Promise<Step> => {
  return updateStep(id, { status: transformStatus(status) });
};

// Delete step
export const deleteStep = async (id: string): Promise<void> => {
  await api.delete(`/steps/${id}`);
};
