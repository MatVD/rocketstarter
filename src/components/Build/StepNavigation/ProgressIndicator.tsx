interface ProgressIndicatorProps {
  currentIndex: number;
  totalSteps: number;
  currentTitle: string;
}

export default function ProgressIndicator({
  currentIndex,
  totalSteps,
  currentTitle,
}: ProgressIndicatorProps) {
  const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="inline-flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
      <div className="text-center">
        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
          Step {currentIndex + 1} of {totalSteps}
        </div>
        <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          {currentTitle}
        </div>
      </div>

      {/* Progress bar */}
      <div className="hidden sm:block w-24">
        <div className="bg-blue-200 dark:bg-blue-800 rounded-full h-2">
          <div
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 text-center">
          {Math.round(progressPercentage)}%
        </div>
      </div>
    </div>
  );
}
