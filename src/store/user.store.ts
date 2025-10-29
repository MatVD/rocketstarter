// src/stores/useUserStoreStore.ts
import { create } from "zustand";
import { UpdateUserRequest, User } from "../types";
import { getUsers, getUser, getUserByAddress, updateUser } from "../api/users";

interface UserState {
  user: User | undefined;
  users: User[];
  loadingUser: boolean;
  onboardingComplete: boolean;
  onboardingStep: 1 | 2 | 3;

  setUser: (user: User | undefined) => void;
  setUsers: (users: User[]) => void;
  setLoadingUser: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setOnboardingStep: (step: 1 | 2 | 3) => void;
  logout: () => void;

  fetchUsers: () => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  getUserByAddress: (address: string) => Promise<User | null>;
  updateUser: (address: string, data: UpdateUserRequest) => Promise<User | null>;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  users: [],
  onboardingStep: 1,
  loadingUser: true,
  onboardingComplete: false,

  setUser: (user) => set({ user }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setUsers: (users) => set({ users }),
  setLoadingUser: (loading) => set({ loadingUser: loading }),
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
  logout: () => set({ user: undefined, onboardingComplete: false }),

  fetchUsers: async () => {
    try {
      const users = await getUsers();
      set({ users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },

  fetchUser: async (id: string) => {
    try {
      const user = await getUser(id);
      set({ user });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  },

  getUserByAddress: async (address: string) => {
    try {
      const user = await getUserByAddress(address);
      return user;
    } catch (error) {
      console.error("Failed to get user by address:", error);
      return null;
    }
  },

  updateUser: async (address: string, data: UpdateUserRequest) => {
    try {
      // Assuming there's an API function to update the user
      const updatedUser = await updateUser(address, data);
      set({ user: updatedUser });
      return updatedUser;
    } catch (error) {
      console.error("Failed to update user:", error);
      return null;
    }
  },

}));
