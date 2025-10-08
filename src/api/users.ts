import api from "./client";
import { User } from "../types";

// User API endpoints
export interface CreateUserRequest {
  name: string;
  email?: string;
  walletAddress: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Transform API response to frontend format
const transformUser = (apiUser: User): User => ({
  address: apiUser.address,
  role: apiUser.role || "builder",
  username: apiUser.username,
  email: apiUser.email,
  createdAt: new Date(apiUser.createdAt),
});

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data.map(transformUser);
};

// Get user by ID
export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return transformUser(response.data);
};

// Get user by wallet address
export const getUserByAddress = async (address: string): Promise<User> => {
  const response = await api.get(`/users/${address}`);
  return transformUser(response.data);
};

// Create new user
export const createUser = async (data: CreateUserRequest): Promise<User> => {
  const response = await api.post("/users", data);
  return transformUser(response.data);
};

// Update user by wallet address
export const updateUser = async (
  address: string,
  data: UpdateUserRequest
): Promise<User> => {
  const response = await api.put(`/users/${address}`, data);
  return transformUser(response.data);
};

// Delete user by wallet address
export const deleteUser = async (address: string): Promise<void> => {
  await api.delete(`/users/${address}`);
};
