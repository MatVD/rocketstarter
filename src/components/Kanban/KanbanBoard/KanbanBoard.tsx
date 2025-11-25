import { motion } from "framer-motion";
import { useState, memo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, User, TaskStatus } from "../../../types";
import Card from "../../UI/Card";
import TaskCard from "./TaskCard/TaskCard";
import DroppableColumn from "./DroppableColumn";
import KanbanColumnHeader from "./KanbanColumnHeader";
import { useKanbanSensors } from "./useKanbanSensors";
import { DEFAULT_COLUMNS as columns } from "./kanbanUtils";
import { useTaskStore } from "../../../store";
import { useToast } from "../../../contexts/ToastContext";

interface KanbanBoardProps {
  tasks: Task[];
  user?: User;
  isBuilderMode?: boolean; // New prop to indicate builder mode
}

function KanbanBoardComponent({
  tasks,
  user,
  isBuilderMode = false,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { showError } = useToast();
  const updateExistingTask = useTaskStore((state) => state.updateExistingTask);

  const onMoveTask = async (taskId: number, newStatus: Task["status"]) => {
    if (newStatus === 3 && user?.role !== "Owner") {
      // Show success notification
      showError("You cannot move tasks to Completed unless you are an Owner.");
      return;
    }

    await updateExistingTask(taskId.toString(), {
      status: newStatus,
    });
  };

  const sensors = useKanbanSensors();

  const getTasksByStatus = (status: number) => {
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

    // Disable drag and drop for builders
    if (isBuilderMode || !over) return;

    const taskId = active.id as number;
    const overId = over.id;
    const activeTask = tasks.find((t) => t.id === taskId);

    // Don't process if no active task found
    if (!activeTask) return;

    // Check if we dropped on a column (string ID like "column-0")
    if (typeof overId === "string" && overId.startsWith("column-")) {
      const columnStatus = parseInt(overId.replace("column-", ""));

      // Verify that columnStatus is a valid TaskStatus
      if (
        (columnStatus === 0 ||
          columnStatus === 1 ||
          columnStatus === 2 ||
          columnStatus === 3) &&
        activeTask.status !== columnStatus
      ) {
        onMoveTask(taskId, columnStatus as TaskStatus);
      }
      return;
    }

    // If dropped on another task (numeric ID), take the status of that task
    if (typeof overId === "number") {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask && overTask.status !== activeTask.status) {
        onMoveTask(taskId, overTask.status);
      }
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Board
          </h3>
          {isBuilderMode && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              You can only take tasks from the "To Do" column. Tasks will
              automatically move to "In Progress" when taken.
            </p>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 md:gap-6 overflow-x-auto">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div
                key={column.id}
                className={`${column.color} flex-1 min-w-[250px] space-y-3 md:space-y-4 relative`}
              >
                <KanbanColumnHeader
                  column={column}
                  taskCount={columnTasks.length}
                  canDelete={columns.length > 1}
                />

                <DroppableColumn
                  id={column.id}
                  className={`rounded-lg p-1 md:p-3 min-h-[300px] md:min-h-[500px]`}
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
                          <TaskCard
                            task={task}
                            variant="kanban"
                            isDraggable={!isBuilderMode} // Disable dragging for builders
                            user={user}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              variant="kanban"
              isDragging
              user={user}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}

export default memo(KanbanBoardComponent);
