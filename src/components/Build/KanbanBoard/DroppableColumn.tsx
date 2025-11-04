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
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${
        isOver 
          ? "ring-4 ring-blue-500 dark:ring-blue-400 scale-[1.02]" 
          : ""
      }`}
      style={{
        transition: "all 0.2s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
