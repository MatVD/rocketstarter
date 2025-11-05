import { GripVertical} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, User as UserType } from "../../../types";
import Card from "../Card";
import TaskCardContent from "./TaskCardContent";


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
