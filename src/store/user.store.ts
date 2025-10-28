// src/stores/useUserStoreStore.ts
import { create } from "zustand";
import { User } from "../types";

interface UserState {
  user: User | undefined;
  loadingUser: boolean;
  onboardingComplete: boolean;
  setUser: (user: User | undefined) => void;
  setLoadingUser: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  logout: () => void;
}

export const useUserStoreStore = create<UserState>((set) => ({
  user: undefined,
  loadingUser: true,
  onboardingComplete: false,

  setUser: (user) => set({ user }),
  setLoadingUser: (loading) => set({ loadingUser: loading }),
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
  logout: () => set({ user: undefined, onboardingComplete: false }),
}));
