import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "../../UI/Modal";
import { useTaskStore } from "../../../store/task.store";
import { useToast } from "../../../contexts/ToastContext";
import { COLORS } from "../../../constants/colors";
import { Task, TaskPriority, User } from "../../../types";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  user?: User;
}

export default function TaskDetailsModal({
  isOpen,
  onClose,
  task,
  user,
}: TaskDetailsModalProps) {
  const { updateExistingTask } = useTaskStore();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOwner = user?.role === "Owner";

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority ?? 1,
    effort: task.effort ?? 1,
    link: task.link || "",
    image: task.image || "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority ?? 1,
        effort: task.effort ?? 1,
        link: task.link || "",
        image: task.image || "",
      });
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    if (!formData.title.trim()) {
      showError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateExistingTask(task.id.toString(), {
        title: formData.title,
        description: formData.description,
        priority: formData.priority as TaskPriority,
        effort: formData.effort,
        link: formData.link,
        image: formData.image,
      });

      if (result) {
        showSuccess("Task updated successfully");
        onClose();
      }
    } catch (error) {
      showError(
        "Failed to update task" +
          (error instanceof Error ? `: ${error.message}` : "")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const readOnlyContent = (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {task.title}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-[200px]">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <div
          className="flex-1 bg-gray-50 dark:bg-gray-900 dark:text-gray-400 rounded-lg p-4 prose dark:prose-invert max-w-none overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html: task.description || "No description provided.",
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <div className="text-gray-900 dark:text-white">
            {task.priority === 0
              ? "Low"
              : task.priority === 2
              ? "High"
              : "Medium"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Effort
          </label>
          <div className="text-gray-900 dark:text-white">{task.effort}</div>
        </div>
      </div>

      {task.link && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Link
          </label>
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {task.link}
          </a>
        </div>
      )}

      {task.image && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image
          </label>
          <img
            src={task.image}
            alt="Task attachment"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded-lg ${COLORS.button.secondary}`}
        >
          Close
        </button>
      </div>
    </div>
  );

  if (!isOwner) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Task Details" type="side">
        {readOnlyContent}
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" type="side">
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
            {isSubmitting ? "Save Changes" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
