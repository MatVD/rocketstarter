import { User, Calendar, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../../../types";
import Card from "../../UI/Card";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

interface TaskCardContentProps {
  task: Task;
}

function TaskCardContent({ task }: TaskCardContentProps) {
  return (
    <>
      <h5 className="font-medium text-gray-900 dark:text-white mb-1 md:mb-2 text-sm md:text-base line-clamp-2">
        {task.title}
      </h5>
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-2 h-2 md:w-3 md:h-3 text-white" />
          </div>
          <span className="text-gray-600 dark:text-gray-400 truncate">
            {task.assignee}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 flex-shrink-0">
          <Calendar className="w-2 h-2 md:w-3 md:h-3" />
          <span className="hidden md:inline">{task.createdAt}</span>
          <span className="md:hidden">{task.createdAt.split("-")[2]}</span>
        </div>
      </div>
    </>
  );
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <Card className="p-3 md:p-4 cursor-grabbing opacity-50 rotate-3 shadow-lg">
        <TaskCardContent task={task} />
      </Card>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`p-3 md:p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
          isSortableDragging
            ? "opacity-50 rotate-3 shadow-lg"
            : "hover:shadow-md"
        }`}
      >
        <div className="flex items-start space-x-2">
          <div className="mt-1 p-1 text-gray-400 transition-colors touch-none">
            <GripVertical className="w-3 h-3 md:w-4 md:h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <TaskCardContent task={task} />
          </div>
        </div>
      </Card>
    </div>
  );
}
