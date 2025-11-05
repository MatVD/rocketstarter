import { User, Calendar, GripVertical, Plus, Clock } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, User as UserType } from "../../../types";
import Card from "../Card";
import {
  getPriorityLabel,
  getPriorityStyle,
} from "../../../utils/priorityUtils";
import { formatDate } from "../../../utils/dateUtils";
import { getStatusColor, getStatusIcon } from "../../../utils/statusUtils";

interface TaskCardProps {
  task: Task;

  // Display options
  variant?: "kanban" | "list" | "simple";
  showProject?: boolean;
  projectName?: string;
  stepName?: string;

  // Drag and drop
  isDragging?: boolean;
  isDraggable?: boolean;

  // User and assignment
  user?: UserType;
  users?: UserType[]; // List of users to get names for assignees
  onTaskAssignment?: (taskId: number) => void;

  // Status actions
  onStatusChange?: (taskId: number, status: number) => void;
  statusButtons?: Array<{
    label: string;
    targetStatus: number;
    show: boolean;
  }>;

  // Utility functions
  getStatusColor?: (status: number) => string;
  getStatusIcon?: (status: number) => React.ReactNode;
}

interface TaskCardContentProps {
  task: Task;
  variant: "kanban" | "list" | "simple";
  showProject?: boolean;
  projectName?: string;
  stepName?: string;
  user?: UserType;
  users?: UserType[];
  onTaskAssignment?: (taskId: number) => void;
  onStatusChange?: (taskId: number, status: number) => void;
  statusButtons?: Array<{
    label: string;
    targetStatus: number;
    show: boolean;
  }>;
}

function TaskCardContent({
  task,
  variant,
  projectName,
  stepName,
  user,
  users,
  onTaskAssignment,
  onStatusChange,
  statusButtons,
}: TaskCardContentProps) {
  const isBuilderMode = user?.role === "Builder";
  const isAssignedToCurrentUser = user && task.builder === user.address;
  const isUnassigned = !task.builder || task.builder === "";
  const isInTodoStatus = task.status === 0;
  const canTakeTask =
    isBuilderMode &&
    !isAssignedToCurrentUser &&
    isUnassigned &&
    isInTodoStatus &&
    onTaskAssignment;

  const StatusButton = ({
    targetStatus,
    taskId,
    label,
  }: {
    targetStatus: number;
    taskId: number;
    label: string;
  }) => (
    <button
      onClick={() => onStatusChange?.(taskId, targetStatus)}
      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors duration-200"
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="flex items-start justify-between">
        {/* Priority badge (always visible) */}
        {typeof task.priority !== "undefined" &&
          getPriorityLabel(task.priority) !== "" && (
            <div className="flex items-center">
              <span className="text-sm text-white mr-2">Priority:</span>
              <span
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium select-none ${
                  getPriorityStyle(task.priority).bg
                } ${getPriorityStyle(task.priority).text} ${
                  getPriorityStyle(task.priority).border
                }`}
                title={`Priority: ${
                  getPriorityLabel(task.priority).charAt(0).toUpperCase() +
                  getPriorityLabel(task.priority).slice(1)
                }`}
                style={{ minWidth: 60, justifyContent: "center" }}
              >
                {getPriorityLabel(task.priority)}
              </span>
            </div>
          )}
        {/* Project and Step info for Builder mode */}
        {variant === "simple" && (projectName || stepName) && (
          <span className="text-xs py-1 text-blue-700 dark:text-blue-300 rounded-md font-medium ml-2">
            {projectName}
          </span>
        )}
        {/* Assignee section - Top Right */}
        {variant === "simple" && user && (
          <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
            {task.builder === user.address ? (
              <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">You</span>
              </div>
            ) : task.builder ? (
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">
                  {users?.find((u) => u.address === task.builder)?.username ||
                    task.builder}
                </span>
              </div>
            ) : onTaskAssignment ? (
              <button
                onClick={() => onTaskAssignment(task.id)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200"
              >
                Take Task
              </button>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Unassigned
              </span>
            )}
          </div>
        )}
      </div>
      <hr className="my-2 border-gray-200 dark:border-gray-700" />
      {/* Header with Title and Assignee */}
      <div className={variant === "kanban" ? "mb-1" : "mb-2"}>
        <div className="flex items-start justify-between mb-1">
          {/* Title section */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <h3
              className={`font-${
                variant === "kanban" ? "medium" : "semibold"
              } text-gray-900 dark:text-white ${
                variant === "kanban" ? "text-sm md:text-base line-clamp-2" : ""
              } truncate`}
            >
              {task.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-xs ${
            variant === "kanban" ? "md:text-sm" : "text-sm"
          } text-gray-600 dark:text-gray-300 ${
            variant === "kanban" ? "line-clamp-2" : ""
          }`}
        >
          {task.description}
        </p>
      </div>

      {/* Builder Task Assignment Section (Kanban only) */}
      {variant === "kanban" &&
        canTakeTask &&
        (isUnassigned ||
          (!isAssignedToCurrentUser && task.builder !== user.address)) && (
          <div className="mb-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTaskAssignment(task.id);
              }}
              className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-800 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Take Task
            </button>
          </div>
        )}

      {/* Status and Meta Information */}
      <div
        className={`flex items-center ${
          variant === "list" ? "justify-between" : ""
        } text-xs space-x-4`}
      >
        {variant === "kanban" ? (
          // Kanban variant - Assignment and date
          <>
            <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
              <div
                className={`w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isAssignedToCurrentUser
                    ? "bg-green-600"
                    : isUnassigned
                    ? "bg-gray-400"
                    : "bg-blue-600"
                }`}
              >
                <User className="w-2 h-2 md:w-3 md:h-3 text-white" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {isAssignedToCurrentUser
                  ? "You"
                  : isUnassigned
                  ? "Unassigned"
                  : task.builder}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 flex-shrink-0">
              <Calendar className="w-2 h-2 md:w-3 md:h-3" />
              <span className="hidden md:inline">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </>
        ) : (
          // List/Simple variants - Status and date
          <>
            <div className="flex items-center space-x-4">
              <span
                className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  getStatusColor
                    ? getStatusColor(task.status)
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {getStatusIcon && getStatusIcon(task.status)}
                <span className="ml-1">{task.status}</span>
              </span>
              <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {variant === "list"
                  ? task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString()
                    : "No date"
                  : task.createdAt
                  ? task.createdAt instanceof Date
                    ? task.createdAt.toLocaleDateString()
                    : task.createdAt
                  : "No date"}
              </span>
            </div>

            {/* Status Buttons */}
            {statusButtons && variant === "list" && (
              <div className="flex items-center space-x-2">
                {statusButtons
                  .filter((button) => button.show)
                  .map((button) => (
                    <StatusButton
                      key={button.targetStatus}
                      targetStatus={button.targetStatus}
                      taskId={task.id}
                      label={button.label}
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function TaskCard({
  task,
  variant = "simple",
  showProject = false,
  projectName,
  stepName,
  isDragging = false,
  isDraggable = false,
  user,
  users,
  onTaskAssignment,
  onStatusChange,
  statusButtons,
}: TaskCardProps) {
  // Drag and drop setup (only if draggable)
  const sortable = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
    disabled: !isDraggable,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = sortable;

  const style = isDraggable
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : {};

  // Content component
  const content = (
    <TaskCardContent
      task={task}
      variant={variant}
      showProject={showProject}
      projectName={projectName}
      stepName={stepName}
      user={user}
      users={users}
      onTaskAssignment={onTaskAssignment}
      onStatusChange={onStatusChange}
      statusButtons={statusButtons}
    />
  );

  // Handle dragging state
  if (isDragging) {
    return (
      <Card className="p-2 md:p-3 cursor-grabbing opacity-50 rotate-3 shadow-lg">
        {content}
      </Card>
    );
  }

  // Draggable variant (Kanban)
  if (isDraggable && variant === "kanban") {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card
          className={`p-2 md:p-3 cursor-grab active:cursor-grabbing transition-all duration-200 ${
            isSortableDragging
              ? "opacity-50 rotate-3 shadow-lg"
              : "hover:shadow-md"
          }`}
        >
          <div className="flex items-start space-x-2">
            <div className="mt-1 p-1 text-gray-400 transition-colors touch-none">
              <GripVertical className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <div className="flex-1 min-w-0 touch-none">{content}</div>
          </div>
        </Card>
      </div>
    );
  }

  // Non-draggable variant (List/Simple)
  return (
    <Card className="p-3 hover:shadow-md transition-shadow duration-200">
      {content}
    </Card>
  );
}
