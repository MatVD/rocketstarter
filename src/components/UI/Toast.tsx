import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export interface ToastProps {
  id?: string;
  message: string;
  type?: "success" | "info" | "warning" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export default function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
  position = "top-right",
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 dark:bg-green-600 text-white";
      case "info":
        return "bg-blue-500 dark:bg-blue-600 text-white";
      case "warning":
        return "bg-orange-500 dark:bg-orange-600 text-white";
      case "error":
        return "bg-red-500 dark:bg-red-600 text-white";
      default:
        return "bg-green-500 dark:bg-green-600 text-white";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed ${getPositionClasses()} z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${getToastStyles()}`}
        >
          {getIcon()}
          <span className="font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded-full transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
