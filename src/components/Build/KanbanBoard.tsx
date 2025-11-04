import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback, memo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
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

/**
 * Custom collision detection specifically for Kanban columns
 * Only detects columns (IDs: 0, 1, 2, 3), not individual task cards
 */
const columnOnlyCollisionDetection: CollisionDetection = (args) => {
  // First try pointerWithin
  const pointerCollisions = pointerWithin(args);
  
  // Filter to only include column IDs (0, 1, 2, 3)
  const columnCollisions = pointerCollisions.filter(
    (collision) => 
      typeof collision.id === 'number' && 
      collision.id >= 0 && 
      collision.id <= 3
  );
  
  if (columnCollisions.length > 0) {
    return columnCollisions;
  }
  
  // Fallback to rectIntersection
  const rectCollisions = rectIntersection(args);
  
  // Filter to only include column IDs
  const columnRectCollisions = rectCollisions.filter(
    (collision) => 
      typeof collision.id === 'number' && 
      collision.id >= 0 && 
      collision.id <= 3
  );
  
  return columnRectCollisions.length > 0 ? [columnRectCollisions[0]] : [];
};

// Memoized TaskCard to prevent unnecessary re-renders
// Only re-renders when task properties actually change
const MemoizedTaskCard = memo(TaskCard, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.isDragging === nextProps.isDragging
  );
});

MemoizedTaskCard.displayName = 'MemoizedTaskCard';

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

  // Memoize tasks filtering by status to avoid recalculation on every render
  const getTasksByStatus = useCallback(
    (status: number) => {
      return tasks.filter((task) => task.status === status);
    },
    [tasks]
  );

  // Memoize columns with their tasks to prevent unnecessary recalculations
  const columnsWithTasks = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: getTasksByStatus(column.id),
    }));
  }, [columns, getTasksByStatus]);

  // Memoize drag start handler to maintain stable reference
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  }, [tasks]);

  // Memoize drag end handler to maintain stable reference
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const taskId = active.id as number;
      const overId = over.id as number;

      // Only handle drops on columns (IDs: 0, 1, 2, 3)
      if (typeof overId !== 'number' || overId < 0 || overId > 3) {
        return;
      }

      const newStatus = overId as TaskStatus;
      
      // Don't move if already in the same status
      const currentTask = tasks.find((t) => t.id === taskId);
      if (currentTask && currentTask.status === newStatus) {
        return;
      }

      // Call update function - parent component handles validation and restrictions
      // (optimistic update handled by store)
      onMoveTask(taskId, newStatus);
    },
    [tasks, onMoveTask]
  );

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
        collisionDetection={columnOnlyCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4">
          {columnsWithTasks.map((column) => (
            <DroppableColumn
              key={column.id}
              id={column.id}
              className="flex-1 min-w-[280px] max-w-[350px] space-y-3 md:space-y-4"
            >
              <KanbanColumnHeader
                column={column}
                taskCount={column.tasks.length}
                canDelete={columns.length > 1}
              />

              <div className={`${column.color} rounded-lg p-3 min-h-[400px] transition-colors duration-200`}>
                <SortableContext
                  items={column.tasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-3">
                      {column.tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            layout: { duration: 0.2 },
                            opacity: { duration: 0.15 },
                          }}
                        >
                          <MemoizedTaskCard
                            task={task}
                            variant="kanban"
                            isDraggable={true}
                            user={user}
                            onTaskAssignment={onTaskAssignment}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </SortableContext>
              </div>
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 cursor-grabbing">
              <MemoizedTaskCard
                task={activeTask}
                variant="kanban"
                isDragging
                user={user}
                onTaskAssignment={onTaskAssignment}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
