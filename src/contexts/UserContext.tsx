import { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from "react";
import { User } from "../types";

type UserContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  logout: () => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  loadingUser: boolean;
  setLoadingUser: (loading: boolean) => void;
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loadingUser, setLoadingUser] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (user) {
      setOnboardingComplete(true);
      setStep(2);
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(undefined);
    setOnboardingComplete(false);
    // Add any additional logout logic here (e.g., clearing tokens)
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      onboardingComplete,
      setOnboardingComplete,
      loadingUser,
      setLoadingUser,
      step,
      setStep,
    }),
    [user, onboardingComplete, loadingUser, logout, step]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};