import { useUserStore } from "../store/user.store";
import { useProjectStore } from "../store/project.store";
import { useTaskStore } from "../store/task.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/UI/Card";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Wallet,
  Edit2,
  Save,
  X,
  Trash2,
  AlertTriangle,
  FolderKanban,
  CheckSquare,
  Clock,
} from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import DataBoundary from "../components/UI/DataBoundary";

export default function ProfilePage() {
  const { user, userLoading, userError, updateUser, deleteUser } =
    useUserStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  // Calculate user statistics
  const userProjects = projects.filter(
    (p) => p.ownerAddress === user?.address
  );
  const userTasks =
    user?.role === "Builder"
      ? tasks.filter((t) => t.builder === user?.address)
      : tasks.filter((t) =>
          userProjects.some((p) => p.id === t.projectId)
        );

  const handleSave = async () => {
    if (!username.trim()) {
      showError("Username cannot be empty");
      return;
    }

    setSaving(true);
    const result = await updateUser(user!.address, { username, email });
    setSaving(false);

    if (result) {
      showSuccess("Profile updated successfully");
      setEditMode(false);
    } else {
      showError("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setEditMode(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deleteUser(user!.address);
    setDeleting(false);
    showSuccess("Account deleted successfully");
    navigate("/onboarding");
  };

  return (
    <div className="p-4 md:p-10 lg:p-12 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <DataBoundary
        isLoading={userLoading}
        error={userError}
        isEmpty={!user}
        dataType="user"
        emptyMessage="User not found"
      >
        {user && (
          <div className="space-y-6">
            {/* Profile Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Profile Information
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Update your personal details
                      </p>
                    </div>
                  </div>
                  {!editMode && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </motion.button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Wallet Address */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Wallet className="w-4 h-4" />
                      Wallet Address
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono break-all">
                      {user.address}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your wallet address cannot be changed
                    </p>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4" />
                      Username
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        maxLength={32}
                        placeholder="Enter your username"
                      />
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {user.username || (
                          <span className="italic text-gray-400">
                            No username set
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (Optional)
                      </span>
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={64}
                        placeholder="your.email@example.com"
                      />
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {user.email || (
                          <span className="italic text-gray-400">
                            No email set
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Member Since */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="w-4 h-4" />
                      Member Since
                    </label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {editMode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </motion.div>
                )}
              </Card>
            </motion.div>

            {/* Statistics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <CheckSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Statistics
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your activity overview
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Projects Count */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                          {user.role === "Owner" ? "Projects Created" : "Projects Joined"}
                        </p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                          {userProjects.length}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-600 dark:bg-blue-700 rounded-lg">
                        <FolderKanban className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Tasks Count */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                          {user.role === "Owner" ? "Tasks Created" : "Tasks Assigned"}
                        </p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                          {userTasks.length}
                        </p>
                      </div>
                      <div className="p-3 bg-green-600 dark:bg-green-700 rounded-lg">
                        <CheckSquare className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 border-red-200 dark:border-red-900/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Irreversible and destructive actions
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>

                  {!showDeleteConfirm ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-sm font-medium text-red-900 dark:text-red-300">
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleDelete}
                          disabled={deleting}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deleting
                            ? "Deleting..."
                            : "Yes, Delete My Account"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={deleting}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </DataBoundary>
    </div>
  );
}
