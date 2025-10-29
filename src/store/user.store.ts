/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/useUserStoreStore.ts
import { create } from "zustand";
import { UpdateUserRequest, User } from "../types";
import { getUsers, getUser, getUserByAddress, updateUser } from "../api/users";

interface UserState {
  user: User | undefined;
  users: User[];
  userLoading: boolean;
  userError: string | null;
  onboardingComplete: boolean;
  onboardingStep: 1 | 2 | 3;

  setUser: (user: User | undefined) => void;
  setUsers: (users: User[]) => void;
  setUserLoading: (loading: boolean) => void;
  setUserError: (error: string | null) => void;
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
  userLoading: true,
  userError: null,
  onboardingComplete: false,

  setUser: (user) => set({ user }),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setUsers: (users) => set({ users }),
  setUserLoading: (loading) => set({ userLoading: loading }),
  setUserError: (error) => set({ userError: error }),
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
  logout: () => set({ user: undefined, onboardingComplete: false }),

  fetchUsers: async () => {
    set({ userLoading: true, userError: null });
    try {
      const users = await getUsers();
      set({ users });
      set({ userLoading: false, userError: null });
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      set({ userLoading: false, userError: error.message });
    }
  },

  fetchUser: async (id: string) => {
    set({ userLoading: true, userError: null });
    try {
      const user = await getUser(id);
      set({ user });
      set({ userLoading: false, userError: null });
    } catch (error: any) {
      console.error("Failed to fetch user:", error);
      set({ userLoading: false, userError: error.message });
    }
  },

  getUserByAddress: async (address: string) => {
    set({ userLoading: true, userError: null });
    try {
      const user = await getUserByAddress(address);
      set({ userLoading: false, userError: null });
      return user;
    } catch (error: any) {
      console.error("Failed to get user by address:", error);
      set({ userLoading: false, userError: error.message });
      return null;
    }
  },

  updateUser: async (address: string, data: UpdateUserRequest) => {
    set({ userLoading: true, userError: null });
    try {
      // Assuming there's an API function to update the user
      const updatedUser = await updateUser(address, data);
      set({ user: updatedUser });
      set({ userLoading: false, userError: null });
      return updatedUser;
    } catch (error: any) {
      console.error("Failed to update user:", error);
      set({ userLoading: false, userError: error.message });
      return null;
    }
  },

}));
