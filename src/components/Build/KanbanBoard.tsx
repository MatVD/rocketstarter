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
import { Task } from "../../types";
import Card from "../UI/Card";
import TaskCard from "./KanbanBoard/TaskCard";
import DroppableColumn from "./KanbanBoard/DroppableColumn";
import KanbanColumnHeader from "./KanbanBoard/KanbanColumnHeader";
import { useKanbanSensors } from "./KanbanBoard/useKanbanSensors";
import {
  createNewColumn,
  updateColumn,
  deleteColumn,
} from "./KanbanBoard/kanbanUtils";

import type { Column } from "./KanbanBoard/kanbanUtils";

interface KanbanBoardProps {
  tasks: Task[];
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  onMoveTask: (taskId: string, newStatus: Task["status"]) => void;
}

export default function KanbanBoard({
  tasks,
  columns,
  setColumns,
  onMoveTask,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useKanbanSensors();

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleAddColumn = () => {
    const newColumn = createNewColumn(columns);
    setColumns((prev) => [...prev, newColumn]);
  };

  const handleEditColumn = (id: string, title: string) => {
    setColumns((prev) => updateColumn(prev, id, title));
  };

  const handleDeleteColumn = (id: string) => {
    setColumns((prev) => {
      if (prev.length === 1) return prev;
      return deleteColumn(prev, id);
    });
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

    // If we drop on a column, move the task to that column's status
    const isColumn = columns.some((col) => col.id === overId);
    if (isColumn) {
      onMoveTask(taskId, overId);
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Project Board
        </h3>

        <button
          onClick={handleAddColumn}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs md:text-sm"
        >
          + Add Column
        </button>
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
                className="space-y-3 md:space-y-4 min-w-[260px] relative"
              >
                <KanbanColumnHeader
                  column={column}
                  taskCount={columnTasks.length}
                  canDelete={columns.length > 1}
                  onEdit={handleEditColumn}
                  onDelete={handleDeleteColumn}
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
                          <TaskCard task={task} />
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
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
