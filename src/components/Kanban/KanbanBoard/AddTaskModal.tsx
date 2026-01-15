import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "../../UI/Modal";
import { useTaskStore } from "../../../store/task.store";
import { useUserStore } from "../../../store/user.store";
import { useToast } from "../../../contexts/ToastContext";
import { COLORS } from "../../../constants/colors";
import { TaskPriority } from "../../../types";
import { Award } from "lucide-react";
import { createReward } from "../../../api/rewards";

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
  const { user } = useUserStore();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: 1 as TaskPriority, // Medium default
    effort: 1,
    reward: "",
    link: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showError("Title is required");
      return;
    }

    if (!user?.address) {
      showError("You must be logged in to create a task");
      return;
    }

    // Validate reward if provided
    if (formData.reward && parseFloat(formData.reward) <= 0) {
      showError("Reward must be a positive number");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create the task
      const result = await createNewTask({
        projectId,
        stepId,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        taskOwner: user.address, // The creator is the task owner (who pays)
        effort: formData.effort,
        ...(formData.link && formData.link.trim() && { link: formData.link.trim() }),
        ...(formData.image && formData.image.trim() && { image: formData.image.trim() }),
        status: 0, // Todo
      });

      if (result) {
        // Step 2: Create the reward if specified
        if (formData.reward && parseFloat(formData.reward) > 0) {
          try {
            await createReward({
              taskId: result.id,
              type: "token",
              value: formData.reward,
            });
          } catch (rewardError) {
            // Task created but reward failed - show warning
            showError(
              "Task created but failed to add reward. You can add it later."
            );
            console.error("Reward creation failed:", rewardError);
          }
        }

        showSuccess("Task created successfully");
        setFormData({
          title: "",
          description: "",
          priority: 1,
          effort: 1,
          reward: "",
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task" type="side">
      <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
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
            className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500 text-lg font-semibold`}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="flex-1 flex flex-col min-h-[300px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              className="h-full flex flex-col"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image", "code-block"],
                  ["clean"],
                ],
              }}
            />
          </div>
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

        {/* Reward Section */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <label className="text-sm font-semibold text-orange-900 dark:text-orange-100">
              Task Reward
            </label>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.reward}
              onChange={(e) =>
                setFormData({ ...formData, reward: e.target.value })
              }
              className={`w-full px-3 py-2 pr-16 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-orange-500 text-lg font-semibold`}
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 dark:text-orange-400 font-bold">
              KUD
            </span>
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
            💡 You will be the <strong>Task Owner</strong> and responsible for paying this reward when the task is completed.
          </p>
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

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
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
