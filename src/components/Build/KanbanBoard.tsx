import { motion } from "framer-motion";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, User, TaskStatus } from "../../types";
import Card from "../UI/Card";
import TaskCard from "../UI/TaskCard";
import DroppableColumn from "./KanbanBoard/DroppableColumn";
import KanbanColumnHeader from "./KanbanBoard/KanbanColumnHeader";
import { useKanbanSensors } from "./KanbanBoard/useKanbanSensors";

import type { Column } from "./KanbanBoard/kanbanUtils";

interface KanbanBoardProps {
  tasks: Task[];
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
  user?: User;
  onTaskAssignment?: (taskId: number) => void;
  isBuilderMode?: boolean; // New prop to indicate builder mode
}

export default function KanbanBoard({
  tasks,
  columns,
  onMoveTask,
  user,
  onTaskAssignment,
  isBuilderMode = false,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
    const overId = over.id as number;

    // If we drop on a column, move the task to that column's status
    const isColumn = columns.some((col) => col.id === overId);
    if (isColumn) {
      // Verify that overId is a valid TaskStatus
      if (overId === 0 || overId === 1 || overId === 2 || overId === 3) {
        onMoveTask(taskId, overId as TaskStatus);
      }
      return;
    }

    // If dropped on another task, take the status of that task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && overTask.status !== active.data.current?.task.status) {
      onMoveTask(taskId, overTask.status);
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
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 md:gap-6 overflow-x-auto">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div
                key={column.id}
                className="flex-1 min-w-[250px] space-y-3 md:space-y-4 relative"
              >
                <KanbanColumnHeader
                  column={column}
                  taskCount={columnTasks.length}
                  canDelete={columns.length > 1}
                />

                <DroppableColumn
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
                          <TaskCard
                            task={task}
                            variant="kanban"
                            isDraggable={!isBuilderMode} // Disable dragging for builders
                            user={user}
                            onTaskAssignment={onTaskAssignment}
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
              onTaskAssignment={onTaskAssignment}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
