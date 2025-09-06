import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export default function ProgressBar({
  progress,
  className = "",
}: ProgressBarProps) {
  return (
    <div
      className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 ${className}`}
    >
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}
