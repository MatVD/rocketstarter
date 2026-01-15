/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/useUserStoreStore.ts

import { create } from "zustand";
import { UpdateUserRequest, User } from "../types";
import { getUsers, getUser, getUserByAddress, updateUser } from "../api/users";
import { logout as logoutAPI, logoutKeepAlive } from "../api/auth";

// --- Setters extraits pour stabilité des références ---
const setUser = (set: any) => (user: User | undefined) => set({ user });
const setUsers = (set: any) => (users: User[]) => set({ users });
const setUserLoading = (set: any) => (loading: boolean) => set({ userLoading: loading });
const setUserError = (set: any) => (error: string | null) => set({ userError: error });
const setIsAuthenticated = (set: any) => (isAuth: boolean) => set({ isAuthenticated: isAuth });
const setOnboardingComplete = (set: any) => (complete: boolean) => set({ onboardingComplete: complete });
const setOnboardingStep = (set: any) => (step: 1 | 2 | 3) => set({ onboardingStep: step });
const setIsAuthenticating = (set: any) => (isAuth: boolean) => set({ isAuthenticating: isAuth });

// --- Fonctions asynchrones extraites pour stabilité et testabilité ---
const logout = (set: any) => async () => {
  try {
    await logoutAPI();
  } catch (error) {
    console.error("[UserStore] Logout error:", error);
  } finally {
    set({
      user: undefined,
      isAuthenticated: false,
      onboardingComplete: false,
      onboardingStep: 1
    });
  }
};

// Async logout with keepalive (waits for completion)
const logoutSync = (set: any) => async () => {
  // Wait for logout to complete (cookie deletion)
  await logoutKeepAlive();
  
  // Clear state after logout completes
  set({
    user: undefined,
    isAuthenticated: false,
    onboardingComplete: false,
    onboardingStep: 1
  });
};

const fetchUsers = (set: any) => async () => {
  // Don't set userLoading to avoid re-renders and infinite loops
  try {
    const users = await getUsers();
    set({ users, userError: null });
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    set({ userError: error.message });
  }
};

const fetchUser = (set: any) => async (id: string) => {
  set({ userLoading: true, userError: null });
  try {
    const user = await getUser(id);
    set({ user });
    set({ userLoading: false, userError: null });
  } catch (error: any) {
    console.error("Failed to fetch user:", error);
    set({ userLoading: false, userError: error.message });
  }
};

const getUserByAddressFn = (set: any) => async (address: string) => {
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
};

const updateUserFn = (set: any) => async (address: string, data: UpdateUserRequest) => {
  // Don't set userLoading to avoid unmounting protected routes
  try {
    const updatedUser = await updateUser(address, data);
    set({ user: updatedUser, userError: null });
    return updatedUser;
  } catch (error: any) {
    console.error("Failed to update user:", error);
    set({ userError: error.message });
    return null;
  }
};

interface UserState {
  user: User | undefined;
  users: User[];
  userLoading: boolean;
  userError: string | null;
  isAuthenticated: boolean; // True when user has valid JWT cookie
  onboardingComplete: boolean;
  onboardingStep: 1 | 2 | 3;
  isAuthenticating: boolean; // Flag to prevent multiple simultaneous auth attempts

  setUser: (user: User | undefined) => void;
  setUsers: (users: User[]) => void;
  setUserLoading: (loading: boolean) => void;
  setUserError: (error: string | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setOnboardingStep: (step: 1 | 2 | 3) => void;
  setIsAuthenticating: (isAuth: boolean) => void;
  logout: () => Promise<void>;
  logoutSync: () => Promise<void>; // Async logout with keepalive

  fetchUsers: () => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  getUserByAddress: (address: string) => Promise<User | null>;
  updateUser: (address: string, data: UpdateUserRequest) => Promise<User | null>;
}


export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  users: [],
  onboardingStep: 1,
  userLoading: false,
  userError: null,
  isAuthenticated: false, // Initially not authenticated
  onboardingComplete: false,
  isAuthenticating: false, // Initially not authenticating


  setUser: setUser(set),
  setUsers: setUsers(set),
  setUserLoading: setUserLoading(set),
  setUserError: setUserError(set),
  setIsAuthenticated: setIsAuthenticated(set),
  setOnboardingComplete: setOnboardingComplete(set),
  setOnboardingStep: setOnboardingStep(set),
  setIsAuthenticating: setIsAuthenticating(set),

  logout: logout(set),
  logoutSync: logoutSync(set),
  fetchUsers: fetchUsers(set),
  fetchUser: fetchUser(set),
  getUserByAddress: getUserByAddressFn(set),
  updateUser: updateUserFn(set),

}));
