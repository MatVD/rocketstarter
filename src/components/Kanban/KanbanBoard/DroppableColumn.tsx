import { useDroppable } from "@dnd-kit/core";

interface DroppableColumnProps {
  id: number;
  className: string;
  children: React.ReactNode;
}

export default function DroppableColumn({
  id,
  className,
  children,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`, // Use string ID with prefix to distinguish from tasks
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? "ring-2 ring-blue-400" : ""}`}
    >
      {children}
    </div>
  );
}
