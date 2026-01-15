import { motion } from "framer-motion";
import { Building2, FileText, Image, Info } from "lucide-react";
import { COLORS } from "../../constants/colors";

interface Step1Props {
  formData: {
    name: string;
    description: string;
    logo: string;
    status: number;
  };
  onChange: (field: string, value: string | number) => void;
  errors: Record<string, string>;
}

const PROJECT_STATUS_OPTIONS = [
  { value: 0, label: "Unspecified" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Approved" },
  { value: 3, label: "Rejected" },
];

export default function Step1ProjectInfo({ formData, onChange, errors }: Step1Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Project Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let's start with the basics of your project
        </p>
      </div>

      {/* Project Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Building2 className="w-4 h-4" />
          Project Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Enter project name"
          className={`
            w-full px-4 py-3 rounded-lg border
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-200
            ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }
            focus:ring-2 focus:outline-none
          `}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <Info className="w-4 h-4" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FileText className="w-4 h-4" />
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe your project..."
          rows={4}
          className="
            w-full px-4 py-3 rounded-lg border
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-500 focus:outline-none
            transition-all duration-200
            resize-none
          "
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
          value={formData.logo}
          onChange={(e) => onChange("logo", e.target.value)}
          placeholder="https://example.com/logo.png"
          className={`
            w-full px-4 py-3 rounded-lg border
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-200
            ${
              errors.logo
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            }
            focus:ring-2 focus:outline-none
          `}
        />
        {errors.logo && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <Info className="w-4 h-4" />
            {errors.logo}
          </p>
        )}
        {formData.logo && !errors.logo && (
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
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Info className="w-4 h-4" />
          Project Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => onChange("status", parseInt(e.target.value))}
          className="
            w-full px-4 py-3 rounded-lg border
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-500 focus:outline-none
            transition-all duration-200
          "
        >
          {PROJECT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
