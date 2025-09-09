import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProgressIndicatorProps {
  currentIndex: number;
  totalSteps: number;
  currentTitle: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function ProgressIndicator({
  currentIndex,
  totalSteps,
  currentTitle,
  onPrevious,
  onNext,
}: ProgressIndicatorProps) {

  return (
    <div className="inline-flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
      {/* Previous Arrow */}
      <button
        onClick={onPrevious}
        disabled={!onPrevious}
        className={`p-2 rounded-lg transition-colors ${
          onPrevious
            ? "hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400"
            : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
        }`}
        aria-label="Previous step"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="text-center">
        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
          Step {currentIndex + 1} of {totalSteps}
        </div>
        <div className="font-semibold text-blue-900 dark:text-blue-100">
          {currentTitle}
        </div>
      </div>

      {/* Next Arrow */}
      <button
        onClick={onNext}
        disabled={!onNext}
        className={`p-2 rounded-lg transition-colors ${
          onNext
            ? "hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400"
            : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
        }`}
        aria-label="Next step"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
