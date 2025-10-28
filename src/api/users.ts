import api from "./client";
import { CreateUserRequest, UpdateUserRequest, User } from "../types";

// User API endpoints

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

// Get user by ID
export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Get user by wallet address
export const getUserByAddress = async (address: string): Promise<User> => {
  const response = await api.get(`/users/${address}`);
  return response.data.data;
};

// Create new user
export const createUser = async (data: CreateUserRequest): Promise<User> => {
  const response = await api.post("/users", data);
  return response.data;
};

// Update user by wallet address
export const updateUser = async (
  address: string,
  data: UpdateUserRequest
): Promise<User> => {
  const response = await api.put(`/users/${address}`, data);
  return response.data;
};

// Delete user by wallet address
export const deleteUser = async (address: string): Promise<void> => {
  await api.delete(`/users/${address}`);
};
