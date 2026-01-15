import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/UI/Card";
import { useProjectStore } from "../store/project.store";
import { useUserStore } from "../store";
import { useToast } from "../contexts/ToastContext";
import { ArrowLeft, Save, Building2, Image, FileText, Users, AlertCircle } from "lucide-react";
import { CreateProjectRequest } from "../types";

const PROJECT_STATUS_OPTIONS = [
  { value: 0, label: "Unspecified" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Approved" },
  { value: 3, label: "Rejected" },
];

export default function CreateProject() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { createNewProject } = useProjectStore();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: "",
    description: "",
    logoUrl: "",
    bank: "0",
    whitelist: [],
    status: 0,
  });

  const [whitelistInput, setWhitelistInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    } else if (formData.name.length > 255) {
      newErrors.name = "Project name must not exceed 255 characters";
    }

    // Logo URL validation
    if (formData.logoUrl && formData.logoUrl.trim()) {
      try {
        new URL(formData.logoUrl);
      } catch {
        newErrors.logoUrl = "Please enter a valid URL";
      }
    }

    // Whitelist validation
    if (whitelistInput.trim()) {
      const addresses = whitelistInput
        .split(/[,\n]/)
        .map((addr) => addr.trim())
        .filter(Boolean);

      for (const addr of addresses) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
          newErrors.whitelist = `Invalid Ethereum address: ${addr}`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please fix the errors before submitting");
      return;
    }

    if (!user?.address) {
      showError("User not authenticated");
      return;
    }

    setSaving(true);

    // Parse whitelist
    const whitelist = whitelistInput
      .split(/[,\n]/)
      .map((addr) => addr.trim().toLowerCase())
      .filter(Boolean);

    const projectData: CreateProjectRequest = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      logoUrl: formData.logoUrl?.trim() || undefined,
      whitelist: whitelist.length > 0 ? whitelist : undefined,
    };

    const result = await createNewProject(projectData);
    setSaving(false);

    if (result) {
      showSuccess("Project created successfully!");
      navigate("/my-projects");
    } else {
      showError("Failed to create project. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/my-projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-10 lg:p-12 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set up your Web3 project and start building
        </p>
      </div>

      {/* Form */}
      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Building2 className="w-4 h-4" />
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${
                errors.name
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors`}
              placeholder="Enter project name"
              maxLength={255}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {formData.name.length}/255 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-colors"
              placeholder="Describe your project..."
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Image className="w-4 h-4" />
              Logo URL
            </label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${
                errors.logoUrl
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors`}
              placeholder="https://example.com/logo.png"
            />
            {errors.logoUrl && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.logoUrl}
              </p>
            )}
          </div>

          {/* Project Status */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: parseInt(e.target.value) as 0 | 1 | 2 | 3,
                })
              }
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white cursor-pointer transition-colors"
            >
              {PROJECT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Whitelist */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users className="w-4 h-4" />
              Whitelist (Ethereum Addresses)
            </label>
            <textarea
              value={whitelistInput}
              onChange={(e) => setWhitelistInput(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border ${
                errors.whitelist
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none font-mono text-sm transition-colors`}
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb&#10;0x123...&#10;(One address per line or comma-separated)"
            />
            {errors.whitelist && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.whitelist}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Enter Ethereum addresses (0x...), separated by commas or new lines
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> The project slug will be generated automatically from the name. 
              Bank balance is read-only and synced from the blockchain.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
