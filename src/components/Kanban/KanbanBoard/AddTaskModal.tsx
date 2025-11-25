import { useState } from "react";
import Modal from "../../UI/Modal";
import { useTaskStore } from "../../../store/task.store";
import { useToast } from "../../../contexts/ToastContext";
import { COLORS } from "../../../constants/colors";
import { TaskPriority } from "../../../types";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  stepId?: number;
}

export default function AddTaskModal({
  isOpen,
  onClose,
  projectId,
  stepId,
}: AddTaskModalProps) {
  const { createNewTask } = useTaskStore();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: 1 as TaskPriority, // Medium default
    effort: 1,
    link: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createNewTask({
        projectId,
        stepId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        effort: formData.effort,
        link: formData.link,
        image: formData.image,
        status: 0, // Todo
      });

      if (result) {
        showSuccess("Task created successfully");
        setFormData({
          title: "",
          description: "",
          priority: 1,
          effort: 1,
          link: "",
          image: "",
        });
        onClose();
      }
    } catch (error) {
      showError(
        "Failed to create task" +
          (error instanceof Error ? `: ${error.message}` : "")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter task description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: parseInt(e.target.value) as TaskPriority,
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500`}
            >
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Effort (Fibonacci)
            </label>
            <select
              value={formData.effort}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  effort: parseInt(e.target.value),
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500`}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={13}>13</option>
              <option value={21}>21</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Link (Optional)
          </label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500`}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500`}
            placeholder="https://..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${COLORS.button.secondary}`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg ${COLORS.button.primary} text-white`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
