import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "../../UI/Modal";
import { useTaskStore } from "../../../store/task.store";
import { useToast } from "../../../contexts/ToastContext";
import { COLORS } from "../../../constants/colors";
import { Task, TaskPriority, User } from "../../../types";
import { Award, Link as LinkIcon, Lock } from "lucide-react";

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
  
  // Check permissions
  const isTaskOwner = user?.address?.toLowerCase() === task.taskOwner?.toLowerCase();
  const isBuilder = user?.address?.toLowerCase() === task.builder?.toLowerCase();
  const canEditDeliverable = isTaskOwner || isBuilder;

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority ?? 1,
    effort: task.effort ?? 1,
    link: task.link || "",
    image: task.image || "",
    deliverableLink: task.deliverableLink || "",
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
        deliverableLink: task.deliverableLink || "",
      });
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Allow both Owner (full edit) and Builder (deliverableLink only)
    if (!isOwner && !isBuilder) return;

    if (!formData.title.trim()) {
      showError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // If builder, only update deliverableLink
      if (isBuilder && !isOwner) {
        const result = await updateExistingTask(task.id.toString(), {
          deliverableLink: formData.deliverableLink || undefined,
        });

        if (result) {
          showSuccess("Work submission updated successfully");
          onClose();
        }
      } else {
        // Owner can update everything
        const result = await updateExistingTask(task.id.toString(), {
          title: formData.title,
          description: formData.description,
          priority: formData.priority as TaskPriority,
          effort: formData.effort,
          link: formData.link,
          image: formData.image,
          deliverableLink: formData.deliverableLink || undefined,
        });

        if (result) {
          showSuccess("Task updated successfully");
          onClose();
        }
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

      {/* Rewards Section */}
      {task.rewards && task.rewards.length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-300">
              Rewards
            </h3>
          </div>
          <div className="space-y-2">
            {task.rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md px-3 py-2 border border-orange-100 dark:border-orange-900/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                    {reward.type}
                  </span>
                  {reward.onChain && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                      On-Chain
                    </span>
                  )}
                </div>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {parseFloat(reward.value).toFixed(2)} KUD
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverable Link Section - Editable for Builder, read-only for taskOwner */}
      {canEditDeliverable && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Work Submission
            </h3>
            <Lock className="w-4 h-4 text-blue-500 dark:text-blue-400 ml-auto" />
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
            🔒 Private: Only visible to builder and task owner
          </p>
          
          {isBuilder && !isOwner ? (
            // Builder can edit deliverableLink
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="url"
                value={formData.deliverableLink}
                onChange={(e) =>
                  setFormData({ ...formData, deliverableLink: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500`}
                placeholder="https://github.com/... or https://figma.com/..."
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-2 rounded-lg ${COLORS.button.primary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? "Saving..." : "Update Submission"}
              </button>
            </form>
          ) : (
            // TaskOwner can only view
            task.deliverableLink ? (
              <a
                href={task.deliverableLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm"
              >
                {task.deliverableLink}
              </a>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No submission yet
              </p>
            )
          )}
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

        {/* Deliverable Link - Editable only by taskOwner and builder */}
        {canEditDeliverable && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-300">
                Work Submission Link
              </label>
              <Lock className="w-4 h-4 text-blue-500 dark:text-blue-400 ml-auto" />
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
              🔒 Private: Only visible to you and the {isTaskOwner ? "builder" : "task owner"}
            </p>
            <input
              type="url"
              value={formData.deliverableLink}
              onChange={(e) =>
                setFormData({ ...formData, deliverableLink: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg ${COLORS.form.input.bg} ${COLORS.form.input.border} ${COLORS.form.input.text} focus:ring-2 focus:ring-blue-500`}
              placeholder="https://github.com/... or https://figma.com/..."
            />
          </div>
        )}

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
