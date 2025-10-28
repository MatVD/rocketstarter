import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types";

type UserContextType = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  logout: () => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  loadingUser: boolean;
  setLoadingUser: (loading: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loadingUser, setLoadingUser] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const logout = () => {
    setUser(undefined);
    // Add any additional logout logic here (e.g., clearing tokens)
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        onboardingComplete,
        setOnboardingComplete,
        loadingUser,
        setLoadingUser,
      }}
    >
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
