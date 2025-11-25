import { motion } from "framer-motion";

interface ProgressBarProps {
  progress?: number;
  className?: string;
}

export default function ProgressBar({
  progress,
  className = "",
}: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress || 0, 0), 100);
  // Keep the label slightly inset so it doesn't overflow the container edges
  const labelPos = Math.min(Math.max(safeProgress, 2), 98);

  return (
    <div
      className={`relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}
    >
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${safeProgress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <motion.div
        className="absolute text-xs text-gray-600 dark:text-gray-300"
        initial={{ left: "0%" }}
        animate={{ left: `${labelPos}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ bottom: "calc(100% + 6px)", transform: "translateX(-50%)" }}
      >
        {Math.round(safeProgress)}%
      </motion.div>
    </div>
  );
}
