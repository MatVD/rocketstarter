import { motion } from "framer-motion";
import { User, Calendar, GripVertical } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Task } from "../../types";
import Card from "../UI/Card";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: Task["status"]) => void;
}

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

function TaskCard({ task, isDragging = false }: TaskCardProps) {
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
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={`p-3 md:p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
          isSortableDragging ? "opacity-50 rotate-3 shadow-lg" : "hover:shadow-md"
        }`}
      >
        <div className="flex items-start space-x-2">
          <div
            {...listeners}
            className="mt-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-none"
          >
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

function TaskCardContent({ task }: { task: Task }) {
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
          <span className="md:hidden">{task.createdAt.split('-')[2]}</span>
        </div>
      </div>
    </>
  );
}

export default function KanbanBoard({ tasks, onMoveTask }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const columns = [
    {
      id: "todo" as const,
      title: "À faire",
      color: "bg-gray-100 dark:bg-gray-800",
      headerColor: "bg-gray-200 dark:bg-gray-700",
    },
    {
      id: "in-progress" as const,
      title: "En cours",
      color: "bg-orange-50 dark:bg-orange-900/10",
      headerColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      id: "done" as const,
      title: "Terminé",
      color: "bg-green-50 dark:bg-green-900/10",
      headerColor: "bg-green-100 dark:bg-green-900/20",
    },
  ];

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Si on dépose sur une colonne
    if (overId === "todo" || overId === "in-progress" || overId === "done") {
      onMoveTask(taskId, overId);
      return;
    }

    // Si on dépose sur une autre tâche, on prend le statut de cette tâche
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && overTask.status !== active.data.current?.task.status) {
      onMoveTask(taskId, overTask.status);
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
        Tableau de bord du projet
      </h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className="space-y-3 md:space-y-4">
                <div
                  className={`${column.headerColor} rounded-lg p-3 flex items-center justify-between`}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                    {column.title}
                  </h4>
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                <div
                  id={column.id}
                  className={`${column.color} rounded-lg p-2 md:p-3 min-h-[300px] md:min-h-[400px]`}
                >
                  <SortableContext
                    items={columnTasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 md:space-y-3">
                      {columnTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <TaskCard task={task} />
                        </motion.div>
                      ))}
                    </div>
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}