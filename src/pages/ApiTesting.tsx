import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Database,
  Users,
  ListTodo,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useBackend } from "../contexts/BackendContext";
import { useProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import { getUsers } from "../api";
import { User } from "../types";
import BackendStatus from "../components/UI/BackendStatus";
import Card from "../components/UI/Card";

const ApiTesting: React.FC = () => {
  const { isBackendConnected } = useBackend();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useTasks();

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const userData = await getUsers();
      setUsers(userData);
    } catch (error) {
      setUsersError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const TestButton: React.FC<{
    onClick: () => void;
    loading: boolean;
    error: string | null;
    data: unknown[];
    label: string;
    icon: React.ReactNode;
  }> = ({ onClick, loading, error, data, label, icon }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-semibold">{label}</h3>
        </div>
        <button
          onClick={onClick}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-1"
        >
          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{loading ? "Loading..." : "Test"}</span>
        </button>
      </div>

      <div className="space-y-2">
        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {!error && data.length > 0 && (
          <div className="flex items-center space-x-2 text-green-500 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Success: {data.length} items loaded</span>
          </div>
        )}

        {data.length > 0 && (
          <div className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded max-h-24 overflow-y-auto">
            <pre>{JSON.stringify(data.slice(0, 2), null, 2)}</pre>
            {data.length > 2 && (
              <div className="text-center mt-1">
                ... and {data.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Testing & Integration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Test your backend connection and API endpoints
          </p>
        </div>
        <BackendStatus />
      </div>

      {!isBackendConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              Backend Not Connected
            </h3>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 mt-1 text-sm">
            Make sure your backend server is running on{" "}
            <code>http://localhost:3000</code>
          </p>
          <div className="mt-3 text-sm text-yellow-700 dark:text-yellow-300">
            <p>To start the backend:</p>
            <code className="block bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded mt-1">
              docker-compose up -d && npm run seed:auto
            </code>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <TestButton
          onClick={refetchProjects}
          loading={projectsLoading}
          error={projectsError}
          data={projects}
          label="Projects API"
          icon={<Database className="w-5 h-5 text-blue-500" />}
        />

        <TestButton
          onClick={refetchTasks}
          loading={tasksLoading}
          error={tasksError}
          data={tasks}
          label="Tasks API"
          icon={<ListTodo className="w-5 h-5 text-green-500" />}
        />

        <TestButton
          onClick={fetchUsers}
          loading={usersLoading}
          error={usersError}
          data={users}
          label="Users API"
          icon={<Users className="w-5 h-5 text-purple-500" />}
        />
      </div>

      {/* Integration Guide */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Integration Guide</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">1. Backend Setup</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <code>
                git clone &lt;backend-repo&gt;
                <br />
                cd rocketstarter-back
                <br />
                docker-compose up -d
                <br />
                npm run seed:auto
              </code>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Test Connection</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <code>curl http://localhost:3000/health</code>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. CORS Configuration</h3>
            <p className="text-gray-600 dark:text-gray-400">
              The backend is configured for <code>http://localhost:5173</code>{" "}
              (Vite default). If you need a different port, update{" "}
              <code>ALLOWED_ORIGINS</code> in the backend .env file.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ApiTesting;
