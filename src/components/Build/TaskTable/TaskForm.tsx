import { useState } from "react";
import { motion } from "framer-motion";
import { Task } from "../../../types";
import {
  getValidationSchema,
  validateForm,
} from "../../../utils/validationUtils";
import { COLORS } from "../../../constants/colors";

interface TaskFormProps {
  onSubmit: (
    task: Omit<Task, "id" | "stepId" | "createdAt" | "updatedAt" | "projectId">
  ) => void;
  onCancel: () => void;
}

export default function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 0 as const, // 0 = todo, 1 = inprogress, 2 = inreview, 3 = done
    assignee: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const validationSchema = getValidationSchema("task");

  const validateFormData = () => {
    const formValidationData = {
      title: formData.title,
      description: formData.description,
      assignee: formData.assignee,
      createdAt: formData.createdAt,
    };

    // Convert readonly schema to mutable
    const mutableSchema = {
      title: [...validationSchema.title],
      description: [...validationSchema.description],
      assignee: [...validationSchema.assignee],
      createdAt: [...validationSchema.createdAt],
    };

    const validation = validateForm(formValidationData, mutableSchema);
    const newErrors: Record<string, string[]> = {};

    Object.entries(validation).forEach(([field, result]) => {
      if (
        field !== "isFormValid" &&
        typeof result === "object" &&
        !result.isValid
      ) {
        newErrors[field] = result.errors;
      }
    });

    setErrors(newErrors);
    return validation.isFormValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFormData()) {
      onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        status: 0, // Reset to todo
        assignee: "",
        createdAt: new Date().toISOString().split("T")[0],
      });
      setErrors({});
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors for this field when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: [] }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`px-3 py-2 border rounded-lg transition-colors ${
                errors.title?.length > 0
                  ? `border-red-500 ${COLORS.form.error}`
                  : `${COLORS.form.input.border} ${COLORS.form.input.focus}`
              } ${COLORS.form.input.bg} ${COLORS.form.input.text}`}
              required
            />
            {errors.title && errors.title.length > 0 && (
              <div className={`mt-1 text-sm ${COLORS.form.error}`}>
                {errors.title.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Assignee"
              value={formData.assignee}
              onChange={(e) => handleChange("assignee", e.target.value)}
              className={`px-3 py-2 border rounded-lg transition-colors ${
                errors.assignee?.length > 0
                  ? `border-red-500 ${COLORS.form.error}`
                  : `${COLORS.form.input.border} ${COLORS.form.input.focus}`
              } ${COLORS.form.input.bg} ${COLORS.form.input.text}`}
              required
            />
            {errors.assignee && errors.assignee.length > 0 && (
              <div className={`mt-1 text-sm ${COLORS.form.error}`}>
                {errors.assignee.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg transition-colors ${
              errors.description?.length > 0
                ? `border-red-500 ${COLORS.form.error}`
                : `${COLORS.form.input.border} ${COLORS.form.input.focus}`
            } ${COLORS.form.input.bg} ${COLORS.form.input.text}`}
            rows={2}
          />
          {errors.description && errors.description.length > 0 && (
            <div className={`mt-1 text-sm ${COLORS.form.error}`}>
              {errors.description.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg transition-colors ${COLORS.button.success}`}
          >
            Add
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg transition-colors ${COLORS.button.secondary}`}
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
