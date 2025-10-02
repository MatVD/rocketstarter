import { AlertCircle, CheckCircle2, Circle, Clock } from "lucide-react";

export const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return <Circle className="w-4 h-4" />;
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />;
      case "review":
        return <Clock className="w-4 h-4" />;
      case "done":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };