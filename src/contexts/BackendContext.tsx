import React, { createContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useAccount } from "wagmi";
import { setUserAddress } from "../api";

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
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);

  // Health check function
  const refetchHealth = useCallback(async () => {
    setBackendLoading(true);
    setBackendError(null);
    try {
      // Add your health check API call here
      // For now, simulate a successful connection
      setIsBackendConnected(true);
      setLastHealthCheck(new Date());
    } catch (error) {
      setIsBackendConnected(false);
      setBackendError(error instanceof Error ? error.message : 'Backend connection failed');
    } finally {
      setBackendLoading(false);
    }
  }, []);

  // Initial health check
  useEffect(() => {
    refetchHealth();
  }, [refetchHealth]);

  // Sync wallet address with API client
  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    } else {
      // In development, use a default address if no wallet is connected
      const defaultDevAddress = "0xOWNER1234567890";
      setUserAddress(defaultDevAddress);
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
