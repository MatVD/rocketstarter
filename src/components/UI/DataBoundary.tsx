import React from "react";
import { motion } from "framer-motion";
import {
  Database,
  RefreshCw,
  AlertTriangle,
  Server,
  Loader2,
} from "lucide-react";
import Card from "./Card";

interface DataBoundaryProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  isBackendConnected?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  loadingMessage?: string;
  dataType?: string; // "projects", "tasks", "users", etc.
}

export default function DataBoundary({
  children,
  isLoading = false,
  error = null,
  isEmpty = false,
  onRetry,
  emptyMessage,
  loadingMessage,
  dataType = "data",
}: DataBoundaryProps) {
  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 space-y-4"
      >
        <Card className="p-8 text-center max-w-md">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading {dataType}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {loadingMessage || `Fetching ${dataType} from backend...`}
          </p>
        </Card>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 space-y-4"
      >
        <Card className="p-8 text-center max-w-md border-red-200 dark:border-red-800">
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4 w-fit">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading {dataType}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
        </Card>
      </motion.div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 space-y-4"
      >
        <Card className="p-8 text-center max-w-md border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 w-fit">
            <Database className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No {dataType} Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {emptyMessage || `No ${dataType} are available at the moment.`}
          </p>
        </Card>
      </motion.div>
    );
  }

  // Success state - render children
  return <>{children}</>;
}

// Specialized boundary for projects
export function ProjectsBoundary({
  children,
  ...props
}: Omit<DataBoundaryProps, "dataType">) {
  return (
    <DataBoundary
      {...props}
      dataType="projects"
      emptyMessage="No projects found. Create your first Web3 project to get started."
    >
      {children}
    </DataBoundary>
  );
}

// Specialized boundary for tasks
export function TasksBoundary({
  children,
  ...props
}: Omit<DataBoundaryProps, "dataType">) {
  return (
    <DataBoundary
      {...props}
      dataType="tasks"
      emptyMessage="No tasks found for this step. Add your first task to begin working."
    >
      {children}
    </DataBoundary>
  );
}

// Specialized boundary for backend connection
export function BackendBoundary({
  children,
  isConnected,
  onRetry,
}: {
  children: React.ReactNode;
  isConnected: boolean;
  onRetry?: () => void;
}) {
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
      >
        <Card className="p-8 text-center max-w-lg border-orange-200 dark:border-orange-800">
          <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full mx-auto mb-6 w-fit">
            <Server className="w-12 h-12 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Backend Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            This feature requires a connection to the backend server. Please
            ensure the backend is running and accessible.
          </p>
          <div className="space-y-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Check Connection</span>
              </button>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>
                💡 Start the backend with:{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  docker-compose up -d
                </code>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return <>{children}</>;
}
