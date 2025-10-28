import { Column } from "../../../types";

interface KanbanColumnHeaderProps {
  column: Column;
  taskCount: number;
  canDelete: boolean;
}

export default function KanbanColumnHeader({
  column,
  taskCount,
}: KanbanColumnHeaderProps) {
  return (
    <div
      className={`${column.headerColor} rounded-lg p-3 flex items-center justify-between`}
    >
      <div className="flex items-center gap-2">
        <>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
            {column.title}
          </h4>
        </>
      </div>
      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
        {taskCount}
      </span>
    </div>
  );
}
