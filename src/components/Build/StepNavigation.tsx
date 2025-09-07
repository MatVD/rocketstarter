import { Step } from "../../types";
import NavigationButton from "./StepNavigation/NavigationButton";
import ProgressIndicator from "./StepNavigation/ProgressIndicator";

interface StepNavigationProps {
  currentStep: Step | null;
  allSteps: Step[];
  onStepChange: (stepId: string) => void;
}

export default function StepNavigation({
  currentStep,
  allSteps,
  onStepChange,
}: StepNavigationProps) {
  if (!currentStep) return null;

  const currentIndex = allSteps.findIndex((step) => step.id === currentStep.id);
  const previousStep = currentIndex > 0 ? allSteps[currentIndex - 1] : null;
  const nextStep =
    currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
      {/* Previous Step */}
      <div className="flex-1">
        {previousStep && (
          <NavigationButton
            step={previousStep}
            direction="previous"
            onClick={() => onStepChange(previousStep.id)}
          />
        )}
      </div>

      {/* Current Step Indicator */}
      <div className="flex-1 flex justify-center">
        <ProgressIndicator
          currentIndex={currentIndex}
          totalSteps={allSteps.length}
          currentTitle={currentStep.title}
        />
      </div>

      {/* Next Step */}
      <div className="flex-1 flex justify-end">
        {nextStep && (
          <NavigationButton
            step={nextStep}
            direction="next"
            onClick={() => onStepChange(nextStep.id)}
          />
        )}
      </div>
    </div>
  );
}
