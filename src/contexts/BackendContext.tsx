import React, { createContext, useEffect, ReactNode } from "react";
import { useAccount } from "wagmi";
import { setUserAddress } from "../api";
import { useBackendHealth } from "../hooks/useBackendHealth";

export interface BackendContextType {
  isBackendConnected: boolean;
  backendLoading: boolean;
  backendError: string | null;
  lastHealthCheck: Date | null;
  refetchHealth: () => void;
}

export const BackendContext = createContext<BackendContextType | undefined>(
  undefined
);

interface BackendProviderProps {
  children: ReactNode;
}

export const BackendProvider: React.FC<BackendProviderProps> = ({
  children,
}) => {
  const { address, isConnected } = useAccount();
  const {
    isConnected: isBackendConnected,
    loading: backendLoading,
    error: backendError,
    lastChecked: lastHealthCheck,
    refetch: refetchHealth,
  } = useBackendHealth();

  // Sync wallet address with API client
  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    } else {
      setUserAddress(null);
    }
  }, [isConnected, address]);

  const value: BackendContextType = {
    isBackendConnected,
    backendLoading,
    backendError,
    lastHealthCheck,
    refetchHealth,
  };

  return (
    <BackendContext.Provider value={value}>{children}</BackendContext.Provider>
  );
};

export const useBackend = () => {
  const context = React.useContext(BackendContext);
  if (context === undefined) {
    throw new Error("useBackend must be used within a BackendProvider");
  }
  return context;
};
