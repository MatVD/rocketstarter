// src/stores/useUserStoreStore.ts
import { create } from "zustand";
import { User } from "../types";

interface UserState {
  user: User | undefined;
  loadingUser: boolean;
  onboardingComplete: boolean;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  setUser: (user: User | undefined) => void;
  setLoadingUser: (loading: boolean) => void;
  setOnboardingComplete: (complete: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  step: 1,
  loadingUser: true,
  onboardingComplete: false,

  setStep: (step) => set({ step }),
  setUser: (user) => set({ user }),
  setLoadingUser: (loading) => set({ loadingUser: loading }),
  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
  logout: () => set({ user: undefined, onboardingComplete: false }),
}));
