import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export interface Column {
  id: string;
  title: string;
  color: string;
  headerColor: string;
}

interface KanbanColumnHeaderProps {
  column: Column;
  taskCount: number;
  canDelete: boolean;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function KanbanColumnHeader({
  column,
  taskCount,
  canDelete,
  onEdit,
  onDelete,
}: KanbanColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");

  const startEditing = () => {
    setIsEditing(true);
    setEditingTitle(column.title);
  };

  const finishEditing = () => {
    if (editingTitle.trim()) {
      onEdit(column.id, editingTitle.trim());
    }
    setIsEditing(false);
    setEditingTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      finishEditing();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditingTitle("");
    }
  };

  return (
    <div
      className={`${column.headerColor} rounded-lg p-3 flex items-center justify-between`}
    >
      <div className="flex items-center gap-2">
        {isEditing ? (
          <input
            autoFocus
            type="text"
            className="font-medium text-gray-900 dark:text-white text-sm md:text-base bg-transparent border-b border-blue-400 outline-none px-1 mr-2"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <>
            <h4 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
              {column.title}
            </h4>
            <button
              title="Edit column name"
              className="ml-1 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={startEditing}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </>
        )}
        {canDelete && (
          <button
            title="Remove Column"
            onClick={() => onDelete(column.id)}
            className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
        {taskCount}
      </span>
    </div>
  );
}
