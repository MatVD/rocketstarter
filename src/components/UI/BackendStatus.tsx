import React from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { useBackend } from "../../contexts/BackendContext";

interface BackendStatusProps {
  className?: string;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ className = "" }) => {
  const {
    isBackendConnected,
    backendLoading,
    backendError,
    lastHealthCheck,
    refetchHealth,
  } = useBackend();

  const getStatusIcon = () => {
    if (backendLoading) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    if (isBackendConnected) {
      return <Wifi className="w-4 h-4" />;
    }
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (backendLoading) return "text-yellow-500";
    if (isBackendConnected) return "text-green-500";
    return "text-red-500";
  };

  const getStatusText = () => {
    if (backendLoading) return "Checking...";
    if (isBackendConnected) return "Backend Connected";
    return "Backend Offline";
  };

  const formatLastCheck = () => {
    if (!lastHealthCheck) return "Never";
    return lastHealthCheck.toLocaleTimeString();
  };

  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>

      {backendError && (
        <div className="flex items-center space-x-1 text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs" title={backendError}>
            Error
          </span>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Last check: {formatLastCheck()}
      </div>

      <button
        onClick={refetchHealth}
        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Refresh connection status"
      >
        <RefreshCw className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

export default BackendStatus;
