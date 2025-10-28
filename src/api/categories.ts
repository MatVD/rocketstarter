import api from "./client";
import { Category } from "../types";

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

// Get categories for a specific task
export const getTaskCategories = async (
  taskId: string
): Promise<Category[]> => {
  const response = await api.get(`/tasks/${taskId}/categories`);
  return response.data;
};

// Add a category to a task
export const addCategoryToTask = async (
  taskId: string,
  categoryId: number
): Promise<void> => {
  await api.post(`/tasks/${taskId}/categories`, { categoryId });
};

// Remove a category from a task
export const removeCategoryFromTask = async (
  taskId: string,
  categoryId: number
): Promise<void> => {
  await api.delete(`/tasks/${taskId}/categories/${categoryId}`);
};
