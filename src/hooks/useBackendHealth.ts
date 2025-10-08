import { useState, useEffect } from "react";
import { checkBackendHealth } from "../api";

// Hook for checking backend connection
export const useBackendHealth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      await checkBackendHealth();
      setIsConnected(true);
      setLastChecked(new Date());
    } catch (err) {
      setIsConnected(false);
      setError(
        err instanceof Error ? err.message : "Backend connection failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected, loading, error, lastChecked, refetch: checkHealth };
};
