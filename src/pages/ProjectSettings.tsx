import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2, AlertTriangle, Building2, Users, Shield } from "lucide-react";
import { useProjectStore, useTaskStore } from "../store";
import { useUserStore } from "../store/user.store";
import { useToast } from "../contexts/ToastContext";
import { COLORS } from "../constants/colors";
import DataBoundary from "../components/UI/DataBoundary";

type TabType = "general" | "whitelist" | "danger";

const PROJECT_STATUS_OPTIONS = [
  { value: 0, label: "Unspecified" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Approved" },
  { value: 3, label: "Rejected" },
];

export default function ProjectSettings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { selectedProject, fetchProject, updateExistingProject, removeProject, projectsLoading } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    status: 0,
  });
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchTasks(id);
    }
  }, [id, fetchProject, fetchTasks]);

  useEffect(() => {
    if (selectedProject) {
      // Check if user is owner
      if (selectedProject.owner.toLowerCase() !== user?.address.toLowerCase()) {
        showError("You don't have permission to edit this project");
        navigate(`/projects/${id}`);
        return;
      }

      // Initialize form with project data
      setFormData({
        name: selectedProject.name,
        description: selectedProject.description || "",
        logo: selectedProject.logo || "",
        status: selectedProject.projectStatus,
      });
      setWhitelist(selectedProject.whitelist || []);
    }
  }, [selectedProject, user, id, navigate, showError]);

  const handleSaveGeneral = async () => {
    if (!id || !selectedProject) return;

    setSaving(true);
    try {
      const updated = await updateExistingProject(id, {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        logoUrl: formData.logo?.trim() || undefined,
        status: formData.status as 0 | 1 | 2 | 3,
      });

      if (updated) {
        showSuccess("Project updated successfully");
      } else {
        showError("Failed to update project");
      }
    } catch (error) {
      showError("An error occurred while updating the project");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWhitelist = async () => {
    if (!id) return;

    setSaving(true);
    try {
      const updated = await updateExistingProject(id, {
        whitelist: whitelist.length > 0 ? whitelist : undefined,
      });

      if (updated) {
        showSuccess("Whitelist updated successfully");
      } else {
        showError("Failed to update whitelist");
      }
    } catch (error) {
      showError("An error occurred while updating the whitelist");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = () => {
    const address = newAddress.trim();
    
    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      showError("Invalid Ethereum address");
      return;
    }

    // Check if already in whitelist
    if (whitelist.some((a) => a.toLowerCase() === address.toLowerCase())) {
      showError("Address already in whitelist");
      return;
    }

    setWhitelist([...whitelist, address.toLowerCase()]);
    setNewAddress("");
  };

  const handleRemoveAddress = (address: string) => {
    setWhitelist(whitelist.filter((a) => a !== address));
  };

  const handleDeleteProject = async () => {
    if (!id) return;

    const projectTasks = tasks.filter((t) => t.projectId === parseInt(id));
    const assignedTasks = projectTasks.filter((t) => t.status > 0); // Status 1-3 = assigned/in progress

    if (assignedTasks.length > 0) {
      showError(`Cannot delete: ${assignedTasks.length} task(s) are currently assigned or in progress`);
      return;
    }

    try {
      const success = await removeProject(id);
      if (success) {
        showSuccess("Project deleted successfully");
        navigate("/my-projects");
      } else {
        showError("Failed to delete project");
      }
    } catch (error) {
      showError("An error occurred while deleting the project");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const projectTasks = tasks.filter((t) => selectedProject && t.projectId === selectedProject.id);
  const assignedTasksCount = projectTasks.filter((t) => t.status > 0).length;
  const canDelete = assignedTasksCount === 0;

  const tabs = [
    { id: "general" as TabType, label: "General", icon: Building2 },
    { id: "whitelist" as TabType, label: "Whitelist", icon: Users },
    { id: "danger" as TabType, label: "Danger Zone", icon: Shield },
  ];

  return (
    <DataBoundary isLoading={projectsLoading} dataType="project">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4 md:p-10 lg:p-12"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/projects/${id}`)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to project
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Project Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your project configuration and settings
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200
                  border-b-2 -mb-px
                  ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  General Information
                </h2>

                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {formData.logo && (
                    <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                      <img
                        src={formData.logo}
                        alt="Logo preview"
                        className="h-20 w-20 object-contain rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {PROJECT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveGeneral}
                  disabled={saving}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${COLORS.button.primary} disabled:opacity-50`}
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {activeTab === "whitelist" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Whitelist Management
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Manage authorized addresses for this project
                  </p>
                </div>

                {/* Add Address */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddAddress()}
                    placeholder="0x..."
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddAddress}
                    className={`px-6 py-3 rounded-lg font-medium ${COLORS.button.primary}`}
                  >
                    Add
                  </button>
                </div>

                {/* Address List */}
                <div className="space-y-2">
                  {whitelist.length === 0 ? (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No addresses in whitelist
                    </p>
                  ) : (
                    whitelist.map((address) => (
                      <div
                        key={address}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <code className="text-sm font-mono text-gray-900 dark:text-white">
                          {address}
                        </code>
                        <button
                          onClick={() => handleRemoveAddress(address)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={handleSaveWhitelist}
                  disabled={saving}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${COLORS.button.primary} disabled:opacity-50`}
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : "Save Whitelist"}
                </button>
              </div>
            )}

            {activeTab === "danger" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Irreversible and destructive actions
                  </p>
                </div>

                {/* Delete Project */}
                <div className="border-2 border-red-500 dark:border-red-600 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Delete Project
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Once you delete a project, there is no going back. All data will be permanently deleted.
                      </p>
                      
                      {/* Task Status */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Total tasks:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{projectTasks.length}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Assigned/In progress:</span>
                          <span className={`font-semibold ${assignedTasksCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            {assignedTasksCount}
                          </span>
                        </div>
                      </div>

                      {!canDelete && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
                          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-800 dark:text-red-300">
                            Cannot delete: {assignedTasksCount} task(s) are currently assigned or in progress. Complete or unassign them first.
                          </p>
                        </div>
                      )}

                      {canDelete && projectTasks.length > 0 && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-4">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            Warning: This project has {projectTasks.length} task(s) that will be deleted.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={!canDelete}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Project
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you absolutely sure you want to delete <strong>{selectedProject?.name}</strong>? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </DataBoundary>
  );
}
